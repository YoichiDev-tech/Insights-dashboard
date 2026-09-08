export function getUserId() {
  let id = localStorage.getItem('pw_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pw_user_id', id);
  }
  return id;
}

export function getSessionId() {
  let id = sessionStorage.getItem('pw_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('pw_session_id', id);
  }
  return id;
}
