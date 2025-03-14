const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'rzHNUsRDPBleSuYAaNckWusZibFnGpBg';
const iv = 'GUwX6SnJchXrcMOs';
class UtilityService {
    formValidation(data, manitoryFields) {
        let fields = Object.keys(data);
        let validObj = {
            isValid: true,
            message: {}
        }
        for (let key of manitoryFields) {
            if (!fields.includes(key) || fields.includes(key) && (data[key] == '')) {
                validObj['isValid'] = false;
                validObj['message'][key] = this.splitAndJoin(key) + ' is required';
            } else if (key === 'email' && !this.isValidEmail(data['email'])) {
                validObj['isValid'] = false;
                validObj['message']['email'] = 'Email is invalid';
            } else if (key == 'password' && data['password'].length <= 3) {
                validObj['isValid'] = false;
                validObj['message']['password'] = "Value must not be greater than 3"
            }
        }
        return validObj;
    }
    splitAndJoin(str) {
        if (this.containsUpperCase(str)) {
            let words = str.split(/(?=[A-Z])/);
            let modifiedWords = words.map(word => word.charAt(0).toLowerCase() + word.slice(1));
            let finalWord = modifiedWords.join(' ');
            return finalWord.charAt(0).toUpperCase() + finalWord.slice(1);
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
    containsUpperCase(str) {
        return /[A-Z]/.test(str);
    }
    isValidEmail(value) {
        const emailReg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g
        return emailReg.test(value);
    }

    encrypt(text) {
        try {
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return encrypted.toString('hex');
        } catch (error) {
            return "Error";
        }
    }

    decrypt(text) {
        try {
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            return '';
        }
    }

    generateId() {
        let addNumber = Date.now() + '' + Math.floor(Math.random() * 1000)
        return Number(addNumber);
    }
}
module.exports = UtilityService;