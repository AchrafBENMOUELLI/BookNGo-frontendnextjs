import pytest
import urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


BASE_URL = "http://localhost:3000"
API_URL = "http://localhost:8000/api/hotels"


def check_server(url, name):
    try:
        urllib.request.urlopen(url, timeout=5)
        print(f"  \u2713 {name} OK ({url})")
    except Exception as e:
        pytest.fail(f"  \u2717 {name} indisponible ({url}): {e}")


def set_value_react(driver, selector, value):
    driver.execute_script(f"""
        const el = document.querySelector('{selector}');
        if (!el) throw new Error('Element not found: {selector}');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        ).set;
        nativeInputValueSetter.call(el, '{value}');
        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
        el.dispatchEvent(new Event('change', {{ bubbles: true }}));
    """)


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1280,720")
    d = webdriver.Chrome(options=options)
    yield d
    d.quit()


def test_admin_login_and_see_hotels(driver):
    check_server(BASE_URL, "Frontend (Next.js)")
    check_server(API_URL, "Backend (Laravel)")

    wait = WebDriverWait(driver, 30)

    # 1. Open admin login page
    driver.get(f"{BASE_URL}/admin/login")
    wait.until(EC.presence_of_element_located((By.ID, "email")))
    assert "login" in driver.current_url

    # 2. Fill email and password via JavaScript (triggers React onChange)
    set_value_react(driver, "#email", "benmouelliachraf@gmail.com")
    set_value_react(driver, "#password", "admin123")

    # 3. Click login button
    login_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
    login_btn.click()

    # 4. Wait for redirect AWAY from login page
    wait.until(EC.url_changes(f"{BASE_URL}/admin/login"))
    print(f"  Redirigé vers: {driver.current_url}")

    # 5. Navigate to hotels page
    driver.get(f"{BASE_URL}/admin/hotels")

    # 6. Wait for table (data loaded, not skeleton)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))

    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")
    assert len(rows) > 0, "No hotel rows in the table"

    print(f"  OK \u2014 {len(rows)} h\u00f4tels affich\u00e9s dans le tableau")
