const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const isValidPassword = (password) => {
    const passwordAsArray = password.split("");
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return password.length >= 8 
            && passwordAsArray.some(char => !isNaN(char * 1))
            && passwordAsArray.some(char => isUpperCase(char))
            && passwordAsArray.some(char => isLowerCase(char));
}

const isUpperCase = (char) => {
    return !format.test(char) 
            && isNaN(char * 1)
            && char === char.toUpperCase();
}

const isLowerCase = (char) => {
    return !format.test(char) 
            && isNaN(char * 1)
            && char === char.toLowerCase();
}

module.exports = {
    isValidPassword,
    isUpperCase,
    isLowerCase
}