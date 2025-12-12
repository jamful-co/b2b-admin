import { apiClient } from './client';

// Generic entity factory
const createEntity = (entityName) => ({
  list(orderBy) {
    const params = orderBy ? `?orderBy=${orderBy}` : '';
    return apiClient.get(`/${entityName}${params}`);
  },

  get(id) {
    return apiClient.get(`/${entityName}/${id}`);
  },

  create(data) {
    return apiClient.post(`/${entityName}`, data);
  },

  update(id, data) {
    return apiClient.put(`/${entityName}/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/${entityName}/${id}`);
  },
});

export const Review = createEntity('reviews');
export const Stat = createEntity('stats');
export const JamGroup = createEntity('jam-groups');
export const Employee = createEntity('employees');
export const SettlementHistory = createEntity('settlement-history');
