export const API_BASE = 'https://assignment-todolist-api.vercel.app/api';
export const tenantId = 'jakesungjaekim'; 

export const endpoints = {
  items: `${API_BASE}/${tenantId}/items`,
  item: (itemId: number) => `${API_BASE}/${tenantId}/items/${itemId}`,
};