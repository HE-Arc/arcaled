import re
import requests
from bs4 import BeautifulSoup


def is_he_arc_email(email):
    # Define the regular expression pattern for a valid email address
    pattern = r"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|he-arc\.ch)$"

    # Use the re.match function to check if the email matches the pattern
    if re.match(pattern, email):
        return True
    else:
        return False


def is_student(email):
    if not is_he_arc_email(email):
        return False

    first_name = email.split('.')[0]
    last_name = email.split('.')[1].split('@')[0]
    # remove possible numbers from the last name
    last_name = re.sub(r'\d+', '', last_name)

    print(f"Searching for {first_name} {last_name}...")

    url = f"https://people.he-arc.ch/recherche.php?nom={last_name}&prenom={first_name}&fonction=&role=&domaine=&service=&unite=&acronyme="

    # request the search results page and disable certificate verification
    page = requests.get(url, verify=False)
    soup = BeautifulSoup(page.content, 'html.parser')

    # Collect all the links to search results that match the criteria
    links = []
    search_results = soup.find_all('a', href=re.compile('^contact.php'))
    for result in search_results:
        # Check if the role is 'Etudiant'
        role = result.find(id='col3').get_text().strip()
        if role == 'Etudiant':
            link = result['href']
            links.append(link)

    # Loop through the links to navigate to each page and check the email address
    for link in links:
        page = requests.get(f"https://people.he-arc.ch/{link}", verify=False)
        soup = BeautifulSoup(page.content, 'html.parser')
        # actual_email = soup.find('span').find('a').get_text().strip()

        # find the script that obfuscates the email address
        # the escipt is inside the content_right div
        js_code = soup.find(id='content_right').find(
            'script').get_text().strip()

        # Example JS code
        """
        '/*<![CDATA[*/eval("var a=\\"Tc3B+hyHC-ovGpOV7Z.Imx5JsdAgE0e8YqliRQ4w@PKz2aNtL6MU_uSkrfjn1WXDFb9\\";
        var b=a.split(\\"\\").sort().join(\\"\\");
        var c=\\"naKPn16aS3zLPrrW6n+pLacPjz3zL\\";
        var d=\\"\\";
        for(var e=0;e<c.length;e++)
            d+=b.charAt(a.indexOf(c.charAt(e)));
            document.getElementById(\\"e647871623\\").innerHTML=\\"<a href=\\\\\\"mailto:\\"+d+\\"\\\\\\">\\"+d+\\"</a>\\"")/*]]>*/'
        """

        # Remove the escape characters
        js_code = js_code.replace('\\"', '"')

        # Extract the relevant variables and their values from the JavaScript code
        a = re.search('var a="(.+?)";', js_code).group(1)
        b = ''.join(sorted(a))
        c = re.search('var c="(.+?)";', js_code).group(1)
        d = ''.join([b[a.index(ch)] for ch in c])

        actual_email = d

        if email == actual_email:
            print(f"{first_name} {last_name} has the email address {email}")
            return True

    print(f"No student with the email address {email} was found")
    return False


if __name__ == "__main__":
    email = "lucas.perrin1@he-arc.ch"
    #email = "sebastien.chappuis1@he-arc.ch"
    #email = "sebastien.chappuis@he-arc.ch"
    print(is_student(email))
