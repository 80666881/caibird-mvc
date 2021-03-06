/**
 * @Creater cmZhou
 * @Desc app settingHelper
 */
import fs from 'fs';
import path from 'path';

class SettingHelper {
    public static readonly instance: SettingHelper = new SettingHelper();
    private constructor() { }

    private readonly GLOBAL_CONFIG_NAME = 'config/global';

    private readonly GLOBAL_SECRET_NAME = 'secret/global';

    private readonly CUSTOM_CONFIG_NAME = 'config/custom';

    private readonly CUSTOM_SECRET_NAME = 'secret/custom';

    public readonly getValue = <T extends dSetting.GlobalConfig | dSetting.CustomConfig | dSetting.GlobalSecret | dSetting.CustomSecret, TKey extends keyof T>(
        key: TKey, filename: string, dft?: T[TKey]
    ): dp.DeepPartial<T[TKey]> | undefined => {
        try {
            if (process.env.IS_LOCAL_TEST) {
                const relativePath = path.relative(__dirname, path.join(process.cwd(), `/dist/server/_dev/setting/${filename}`)).replace(/\\/g, '/');
                const obj = (require(relativePath) as { default: T }).default;
                return (obj[key] || dft) as dp.DeepPartial<T[TKey]>;
            }
            const jsonStr = fs.readFileSync(`/etc/my-setting/${filename}/${key}`, 'utf-8');

            try {
                const obj = JSON.parse(jsonStr);
                if (obj && typeof obj === 'object') {
                    return obj as dp.DeepPartial<T[TKey]>;
                }

                return jsonStr as any;
            } catch {
                return jsonStr as any;
            }
        } catch {
            return dft as dp.DeepPartial<T[TKey]>;
        }
    }

    public readonly getGlobalConfig = <TKey extends keyof dSetting.GlobalConfig>(key: TKey, dft?: dSetting.GlobalConfig[TKey]) => this.getValue<dSetting.GlobalConfig, TKey>(key, this.GLOBAL_CONFIG_NAME, dft);

    public readonly getGlobalSecret = <TKey extends keyof dSetting.GlobalSecret>(key: TKey, dft?: dSetting.GlobalSecret[TKey]) => this.getValue<dSetting.GlobalSecret, TKey>(key, this.GLOBAL_SECRET_NAME, dft);

    public readonly getCustomConfig = <TKey extends keyof dSetting.CustomConfig>(key: TKey, dft?: dSetting.CustomConfig[TKey]) => this.getValue<dSetting.CustomConfig, TKey>(key, this.CUSTOM_CONFIG_NAME, dft);

    public readonly getCustomSecret = <TKey extends keyof dSetting.CustomSecret>(key: TKey, dft?: dSetting.CustomSecret[TKey]) => this.getValue<dSetting.CustomSecret, TKey>(key, this.CUSTOM_SECRET_NAME, dft);
}

export const settingHelper = SettingHelper.instance;
export default settingHelper;
