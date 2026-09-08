export async function getGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();

    return {
      country: data.country_name || null,
      city: data.city || null
    };
  } catch {
    return { country: null, city: null };
  }
}
