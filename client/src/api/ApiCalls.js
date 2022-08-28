import axios from "axios";

export async function getBoroughSummary(setSummary) {
  let res = await axios.get("http://localhost:8081/Homepage");
  setSummary(res.data);
}

export async function getNeighborhoodSummary(bv, nv, setSummary) {
  const url = `http://localhost:8081/Neighborhood?borough=${bv}&neighborhood=${nv}`;
  try {
    let res = await axios.get(url, { timeout: 3000 });
    setSummary(res?.data[0]);
  } catch (err) {
    setSummary({ error: "Something went wrong, could not load data." });
  }
}

export async function getRecommendedList(id, setSimList) {
  if (!id || !setSimList) return;
  let res = await axios.get(`http://localhost:8081/Recommend?listing_id=${id}`);
  setSimList(res.data);
}

export async function getNbrRecommendedList(nv, setNbList) {
  if (!nv || !setNbList) return;
  let res = await axios.get(
    `http://localhost:8081/NbrhoodRecommend?nbrhood=${nv}`
  );
  setNbList(res.data);
}

export async function getNbList(boroughVal, setNbList) {
  let res = await axios.get(
    `http://localhost:8081/NeighborhoodList/${boroughVal}`
  );
  setNbList(res.data);
}

export async function getSearchResults(sc, setList) {
  if (!sc) return;
  // console.log(sc);
  const url = `http://localhost:8081/search?borough=${sc.borough}&price_min=${sc.price_min}&price_max=${sc.price_max}&crime_rate=${sc.crime_rate}&accommodates=${sc.accommodates}&is_superhost=${sc.is_superhost}&order_by=${sc.order_by}`;
  // console.log(url);
  let res = await axios.get(url);
  setList(res.data);
}

export async function getListingDetail(id, setDetail) {
  let res = await axios.get(`http://localhost:8081/listingdetail/${id}`);
  setDetail(res.data[0]);
}
