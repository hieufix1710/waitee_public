// tenantSettings.ts
export interface Tenant {
  name: string | null;
  setTenant: (name: string) => void;
  getTenant: () => string | null;
  clearTenant: () => void;
}

const tenantSettings: Tenant = {
  name: null,

  setTenant: function (name: string) {
    this.name = name;
  },

  getTenant: function () {
    return this.name; // Retrieve tenant name from localStorage
  },

  clearTenant: function () {
    return (this.name = null);
  },
};

export default tenantSettings;
