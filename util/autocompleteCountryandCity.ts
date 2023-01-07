const autocompleteCountryandCity = async (value: string, country?: string) => {
  if (value.length < 2) return;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "0d8ad8371emsh50d3dbf53109e4ep126717jsn9463ea1fe23a",
      "X-RapidAPI-Host": "spott.p.rapidapi.com",
    },
  };
  try {
    const url = `https://spott.p.rapidapi.com/places/autocomplete?limit=10&skip=0${
      country ? `&country=${country}` : ""
    }&q=${value}&type=${country ? "CITY" : "COUNTRY"}`;
    console.log(url);
    const response = await fetch(url, options);
    const data: {
      id: string;
      name: string;
    }[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default autocompleteCountryandCity;
