/**
 * @Creater cmZhou
 * @Desc app contextHelper
 */
import { createNamespace } from 'cls-hooked';

import { cError } from '../../constant/cError';

class ContextHelper {
    public static readonly instance: ContextHelper = new ContextHelper();
    private constructor() { }

    private readonly ZONE_NAME = 'context';
    private readonly CTX_KEY = 'ctx';
    private readonly TAMP_KEY = 'tamp';

    private defaultTimestamp = true;

    private readonly zone = createNamespace(this.ZONE_NAME);

    public readonly run = async <TState, TCustom>(ctx: dMvc.Ctx<TState, TCustom>, fn: () => dp.PromiseOrSelf<void>) =>
        this.zone.runPromise(async () => {
            try {
                this.zone.set(this.CTX_KEY, ctx);
                this.zone.set(this.TAMP_KEY, { timestamp: [] });
                await fn();
            } catch (e) {
                throw e;
            } finally {
                this.clear();
            }
        })

    public readonly get = <TState = any, TCustom = {}>() => {
        const ctx = this.zone.get(this.CTX_KEY) as dMvc.Ctx<TState, TCustom> | null;
        if (ctx) return ctx;
        throw new cError.Status({ status: eHttp.StatusCode.ServerError, msg: 'No Found Context' }, { key: 'NO_FOUND_CTX' });
    }

    public readonly getOrNull = <TState = any, TCustom = {}>() => {
        const ctx = this.zone.get(this.CTX_KEY) as dMvc.Ctx<TState, TCustom> | null;
        if (ctx) return ctx;
        return null;
    }

    public readonly clear = () => {
        setTimeout(() => {
            this.zone.set(this.CTX_KEY, undefined);
            this.zone.set(this.TAMP_KEY, undefined);
        }, eDate.MillisecondCount.OneSecond);
    }

    public readonly disableDefaultTimestamp = () => this.defaultTimestamp = false;

    public readonly addTamp = (key: string) => {
        if (!this.defaultTimestamp) return;
        try {
            const tamp = this.zone.get(this.TAMP_KEY) as Tamp | null;
            if (tamp) {
                if (tamp.timestamp) {
                    const last = tamp.timestamp[tamp.timestamp.length - 1];
                    const now = Date.now();
                    tamp.timestamp.push({ key, value: now, span: last && (now - last.value) });
                }
            }
        } catch {

        }
    }

    public readonly getTamp = () => this.zone.get(this.TAMP_KEY) as Tamp | null;
}

type Tamp = { timestamp: { key: string; value: number; span: number }[] };

export const contextHelper = ContextHelper.instance;
export default contextHelper;
