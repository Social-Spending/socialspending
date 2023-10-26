
/*
*   getCookieValue: Retrieves the value of a specific cookie
*       @param: name     - name of cookie to retrieve
*       @return: string  - value of cookie or and empty string if not found
*/
export function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
        return match[2]
    }
    return "";
}






	