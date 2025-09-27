// DefaultConfigStore implementation for Self.xyz verification

export class DefaultConfigStore {
  constructor(config) {
    this.config = {
      minimumAge: 18,
      excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
      ofac: true,
      ...config
    };
  }

  // Required by IConfigStorage interface
  async getConfig(id) {
    return this.config;
  }

  async setConfig(id, config) {
    this.config = { ...this.config, ...config };
    return true;
  }

  async getActionId(userIdentifier, data) {
    // For default store, return the user identifier as action ID
    return userIdentifier;
  }

  // Legacy methods for backward compatibility
  async getMinimumAge() {
    return this.config.minimumAge;
  }

  async getExcludedCountries() {
    return this.config.excludedCountries;
  }

  async getOfacEnabled() {
    return this.config.ofac;
  }
}