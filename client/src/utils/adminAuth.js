const adminCredentials = {
  email: 'cloudscape@admin.com',
  password: 'cloudadmin123!'
};

export const adminLogin = (email, password) => {
  if (email === adminCredentials.email && password === adminCredentials.password) {
    localStorage.setItem('isAdmin', 'true');
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem('isAdmin');
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem('isAdmin') === 'true';
};