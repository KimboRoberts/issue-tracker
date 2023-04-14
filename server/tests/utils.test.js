const { isValidPassword, isUpperCase, isLowerCase } = require('../src/lib/utils');

//  isUpperCase
describe("Test isUpperCase on upper case letter", () => {
    it("should return true", async () => {
        const char = 'C';
        const result = isUpperCase(char);
        expect(result).toBe(true);
    });
});

describe("Test isUpperCase on lower case letter", () => {
    it("should return fasle", async () => {
        const char = 'c';
        const result = isUpperCase(char);
        expect(result).toBe(false);
    });
});

describe("Test isUpperCase on numeric character", () => {
    it("should return false", async () => {
        const char = '2';
        const result = isUpperCase(char);
        expect(result).toBe(false);
    });
});

describe("Test isUpperCase on special character", () => {
    it("should return false", async () => {
        const char = '!';
        const result = isUpperCase(char);
        expect(result).toBe(false);
    });
});

// isLowerCase
//  isUpperCase
describe("Test isLowerCase on upper case letter", () => {
    it("should return false", async () => {
        const char = 'C';
        const result = isLowerCase(char);
        expect(result).toBe(false);
    });
});

describe("Test isLowerCase on lower case letter", () => {
    it("should return true", async () => {
        const char = 'c';
        const result = isLowerCase(char);
        expect(result).toBe(true);
    });
});

describe("Test isLowerCase on numeric character", () => {
    it("should return false", async () => {
        const char = '2';
        const result = isLowerCase(char);
        expect(result).toBe(false);
    });
});

describe("Test isLowerCase on special character", () => {
    it("should return false", async () => {
        const char = '!';
        const result = isLowerCase(char);
        expect(result).toBe(false);
    });
});

// isValidPassword
describe("Test for validity of valid password i.e. 8 characters, >= 1 uppercase/lowercase, >=1 number", () => {
    it("should return true", async () => {
        const password = "Esaradev2!";
        const result = isValidPassword(password);
        expect(result).toBe(true);
    });
});

describe("Test for validity of valid password with less than 8 characters", () => {
    it("should return false", async () => {
        const password = "Esv2!";
        const result = isValidPassword(password);
        expect(result).toBe(false);
    });
});

describe("Test for validity of valid password that does not contain an uppercase character", () => {
    it("should return false", async () => {
        const password = "esaradev2!";
        const result = isValidPassword(password);
        expect(result).toBe(false);
    });
});

describe("Test for validity of valid password that does not contain a lowecase character", () => {
    it("should return false", async () => {
        const password = "ESARADEV2!";
        const result = isValidPassword(password);
        expect(result).toBe(false);
    });
});

describe("Test for validity of valid password that does not contain a number", () => {
    it("should return true", async () => {
        const password = "Esaradev!";
        const result = isValidPassword(password);
        expect(result).toBe(false);
    });
});

describe("Test for validity of valid password that does not contain a special character", () => {
    it("should return true", async () => {
        const password = "Esaradev";
        const result = isValidPassword(password);
        expect(result).toBe(false);
    });
});