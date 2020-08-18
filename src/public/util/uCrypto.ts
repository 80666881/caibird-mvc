/**
 * Created by cmZhou
 * public 加密工具
 */
import crypto from 'crypto';

namespace _uCrypto {
    let defaultConfig = {
        key: 'caibird-mvc_default_key',
        iv: 'caibird-mvc_default_iv1'
    };

    export const syncHash = (data: Data, algorithm: string, partSize = 100000) => {
        const hash = crypto.createHash(algorithm);
        const total = Math.ceil(data.length / partSize);
        for (let i = 0; i < total; i++) {
            const part = data.slice(i * partSize,
                i === total - 1 ? Math.min((i + 1) * partSize, data.length) : (i + 1) * partSize);
            hash.update(part);
        }
        return hash.digest('hex');
    };

    export const setDefaultCryptConfig = (cfg: typeof defaultConfig) => defaultConfig = { ...cfg };

    export const strEncrypt = (data: string, key = defaultConfig.key, iv: crypto.BinaryLike = defaultConfig.iv) => {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    };

    export const strDecrypt = (encrypted: string, key = defaultConfig.key, iv: crypto.BinaryLike = defaultConfig.iv) => {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };
}

//#region 私有类型
type Data = string | Buffer;
//#endregion

export const uCrypto: dp.DeepReadonly<typeof _uCrypto> = _uCrypto;
export default uCrypto;
