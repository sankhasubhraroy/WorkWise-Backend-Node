export default async function getCoordinatesFromAddress(address) {
    const response = await fetch(`https://geocode.maps.co/search?q=${address}`);
    const data = await response.json();
    console.log(data);
    if(data.length === 0) throw new Error("Invalid address");
    return {
        longitude: data[0].lon,
        latitude: data[0].lat,
    };
}