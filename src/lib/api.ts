const API_BASE = '/api'

export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.statusMessage || `API error: ${response.status}`)
  }

  return response.json()
}

export const authApi = {
  login: (username: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  me: () => apiRequest('/auth/me'),
}

export const sitesApi = {
  getAll: () => apiRequest('/sites'),
}

export const subSitesApi = {
  getAll: (siteId?: string) => {
    const params = siteId ? `?site_id=${siteId}` : ''
    return apiRequest(`/sub-sites${params}`)
  },
}

export const servicesApi = {
  getAll: (subSiteId?: string) => {
    const params = subSiteId ? `?sub_site_id=${subSiteId}` : ''
    return apiRequest(`/services${params}`)
  },
}

export const mealPeriodsApi = {
  getAll: () => apiRequest('/meal-periods'),
}

export const mealCategoriesApi = {
  getAll: () => apiRequest('/meal-categories'),
}

export const pricesApi = {
  getAll: () => apiRequest('/prices'),
  create: (data: any) =>
    apiRequest('/prices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const dailyRecordsApi = {
  getAll: (params?: { sub_site_id?: string; date?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.sub_site_id) searchParams.set('sub_site_id', params.sub_site_id)
    if (params?.date) searchParams.set('date', params.date)
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiRequest(`/daily-records${query}`)
  },
  create: (data: any) =>
    apiRequest('/daily-records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const dashboardApi = {
  getStats: (params?: { date_range?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.date_range) searchParams.set('date_range', params.date_range)
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiRequest(`/dashboard-stats${query}`)
  },
}