/**
 * @Creater cmZhou
 * @Desc sessionStorage 工具
 */
import { uObject } from './uObject';
namespace _uSessionStorage {
    export const clear = () => {
        if (sessionStorage) {
            sessionStorage.clear();
        }
    };

    export const getValue = (key: string) => {
        if (sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return undefined;
    };

    export const setValue = (key: string, value: string) => {
        if (sessionStorage) {
            sessionStorage.setItem(key, value);
        }
    };

    export const remove = (key: string) => {
        if (sessionStorage) {
            sessionStorage.removeItem(key);
        }
    };

    const objectKey = '__caibird-mvc_custom_session_storage_obj___';

    export const getObjectValue = <T>(key: string) => {
        const objStr = getValue(objectKey);
        try {
            const obj = JSON.parse(objStr || '') as dp.Obj;
            return obj[key] as T;
        } catch {
            return undefined;
        }
    };

    export const setObjectValue = (key: string, value: any) => {
        const objStr = getValue(objectKey);
        let obj: dp.Obj = {};
        try {
            obj = JSON.parse(objStr || '') as dp.Obj;
        } catch {
        }
        obj[key] = value;
        setValue(objectKey, uObject.safeStringify(obj));
    };
}

export const uSessionStorage: dp.DeepReadonly<typeof _uSessionStorage> = _uSessionStorage;
export default uSessionStorage;
