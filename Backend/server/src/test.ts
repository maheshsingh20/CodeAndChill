import fetch from "node-fetch";

const API_KEY = "AIzaSyB9kj5v1FkjAn5VOTY6WVSf4gHttGNWJZo";


async function listModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  data.models.forEach((m: any) => {
    console.log(m.name);
  });
}

listModels();
