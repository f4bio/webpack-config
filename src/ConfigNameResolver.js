import ConfigEnvironment from './ConfigEnvironment';
import ConfigPatternCache from './ConfigPatternCache';
import ConfigRegistry from './ConfigRegistry';

/**
* @private
* @type {WeakMap}
*/
const ENVIRONMENT = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const PATTERN_CACHE = new WeakMap();

/**
 * @class
 */
class ConfigNameResolver {
    /**
     * @constructor
     * @param {ConfigEnvironment} environment
     * @param {ConfigPatternCache} [patternCache]
     */
    constructor(environment, patternCache = new ConfigPatternCache()) {
        ENVIRONMENT.set(this, environment);
        PATTERN_CACHE.set(this, patternCache);
    }

    /**
     * @readonly
     * @type {ConfigEnvironment}
     */
    get environment() {
        return ENVIRONMENT.get(this);
    }

    /**
     * @readonly
     * @type {ConfigPatternCache}
     */
    get patternCache() {
        return PATTERN_CACHE.get(this);
    }

    /**
     * @param {String} value
     * @returns {String}
     */
    resolve(value) {
        const options = {};

        for (const key of this.environment.keys()) {
            options[key] = this.environment.valueOf(key);
        }

        return this.patternCache.eval(value, options);
    }

    /**
     * @readonly
     * @type {ConfigNameResolver}
     */
    static get INSTANCE() {
        return ConfigRegistry.INSTANCE.getOrSet(this, () => new ConfigNameResolver(ConfigEnvironment.INSTANCE, ConfigPatternCache.INSTANCE));
    }
}

export default ConfigNameResolver;