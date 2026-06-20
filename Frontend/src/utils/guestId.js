function generateId() {
  const chars = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

export function getGuestId() {
  let id = localStorage.getItem("guestUserId");
  if (!id) {
    id = generateId();
    localStorage.setItem("guestUserId", id);
  }
  return id;
}