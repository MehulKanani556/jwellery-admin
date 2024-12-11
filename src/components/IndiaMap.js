import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Use built-in Leaflet icons
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    shadowSize: [41, 41] // size of the shadow
});

export default function IndiaMap({ stateNames }) {
    // Define bounds for India
    const bounds = [
        [8.083, 68.176], // Southwest corner
        [37.6, 97.395]   // Northeast corner
    ];

    // Define positions with state names
    const positions = [
        { name: 'Delhi', lat: 28.6139, lng: 77.2090, color: 'green' },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639, color: 'blue' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, color: 'purple' },
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946, color: 'orange' },
        { name: 'Jaipur', lat: 26.9124, lng: 75.7873, color: 'red' },
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, color: 'yellow' },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, color: 'pink' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'brown' },
        { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, color: 'grey' },
        { name: 'Surat', lat: 21.1702, lng: 72.8311, color: 'teal' },
        { name: 'Lucknow', lat: 26.8467, lng: 80.9462, color: 'cyan' },
        { name: 'Kanpur', lat: 26.4499, lng: 80.3319, color: 'magenta' },
        { name: 'Nagpur', lat: 21.1458, lng: 79.0882, color: 'lime' },
        { name: 'Indore', lat: 22.7174, lng: 75.8573, color: 'olive' },
        { name: 'Bhopal', lat: 23.2599, lng: 77.4126, color: 'maroon' },
        { name: 'Patna', lat: 25.5941, lng: 85.1376, color: 'navy' },
        { name: 'Ranchi', lat: 23.3472, lng: 85.3363, color: 'silver' },
        { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, color: 'gold' },
        { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, color: 'crimson' },
        { name: 'Dehradun', lat: 30.3165, lng: 78.0322, color: 'forestgreen' },
        { name: 'Shimla', lat: 31.1048, lng: 77.1734, color: 'darkgreen' },
        { name: 'Srinagar', lat: 34.0837, lng: 74.7973, color: 'lightgreen' },
        { name: 'Jammu', lat: 32.7266, lng: 74.8570, color: 'seagreen' },
        { name: 'Gandhinagar', lat: 23.2156, lng: 72.6762, color: 'mediumseagreen' },
        { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, color: 'springgreen' },
        { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, color: 'lawngreen' },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, color: 'chartreuse' },
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, color: 'limegreen' },
        { name: 'Kochi', lat: 9.9663, lng: 76.2608, color: 'palegreen' },
        { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, color: 'lightgreen' },
        { name: 'Vijayawada', lat: 16.5193, lng: 80.6477, color: 'seagreen' },
        { name: 'Amaravati', lat: 16.5167, lng: 80.5133, color: 'mediumseagreen' },
        { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, color: 'springgreen' },
        { name: 'Ranchi', lat: 23.3472, lng: 85.3363, color: 'lawngreen' },
        { name: 'Patna', lat: 25.5941, lng: 85.1376, color: 'chartreuse' },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639, color: 'limegreen' },
        { name: 'Guwahati', lat: 26.1845, lng: 91.7671, color: 'palegreen' },
        { name: 'Dispur', lat: 26.1473, lng: 91.7671, color: 'seagreen' },
        { name: 'Itanagar', lat: 27.0837, lng: 93.6173, color: 'mediumseagreen' },
        { name: 'Gangtok', lat: 27.3367, lng: 88.6064, color: 'springgreen' },
        { name: 'Imphal', lat: 24.7965, lng: 93.9462, color: 'lawngreen' },
        { name: 'Shillong', lat: 25.5679, lng: 91.8915, color: 'chartreuse' },
        { name: 'Aizawl', lat: 23.7289, lng: 92.7151, color: 'limegreen' },
        { name: 'Kohima', lat: 25.6744, lng: 94.1084, color: 'palegreen' },
        { name: 'Bhopal', lat: 23.2599, lng: 77.4126, color: 'seagreen' },
        { name: 'Raipur', lat: 21.2456, lng: 81.6333, color: 'mediumseagreen' },
        { name: 'Panaji', lat: 15.4909, lng: 73.8278, color: 'springgreen' },
        { name: 'Gandhinagar', lat: 23.2156, lng: 72.6762, color: 'lawngreen' },
        { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, color: 'chartreuse' },
        { name: 'Shimla', lat: 31.1048, lng: 77.1734, color: 'limegreen' },
        { name: 'Dehradun', lat: 30.3165, lng: 78.0322, color: 'palegreen' },
        { name: 'Srinagar', lat: 34.0837, lng: 74.7973, color: 'seagreen' },
        { name: 'Jammu', lat: 32.7266, lng: 74.8570, color: 'mediumseagreen' },
        { name: 'Rajkot', lat: 22.2999, lng: 70.7833, color: 'springgreen' },
        { name: 'Gandhinagar', lat: 23.2156, lng: 72.6762, color: 'lawngreen' },
        { name: 'Surat', lat: 21.1702, lng: 72.8311, color: 'chartreuse' },
        { name: 'Vadodara', lat: 22.3072, lng: 73.1812, color: 'limegreen' },
        { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, color: 'palegreen' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'seagreen' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, color: 'mediumseagreen' },
        { name: 'Nagpur', lat: 21.1458, lng: 79.0882, color: 'springgreen' },
        { name: 'Nashik', lat: 20.0000, lng: 73.7833, color: 'lawngreen' },
        { name: 'Aurangabad', lat: 19.8773, lng: 75.3213, color: 'chartreuse' },
        { name: 'Solapur', lat: 17.6712, lng: 75.9077, color: 'limegreen' },
        { name: 'Kolhapur', lat: 16.6953, lng: 74.2439, color: 'palegreen' },
        { name: 'Sangli', lat: 16.8593, lng: 74.5639, color: 'seagreen' },
        { name: 'Satara', lat: 17.6833, lng: 74.0333, color: 'mediumseagreen' },
        { name: 'Ratnagiri', lat: 16.9833, lng: 73.3000, color: 'springgreen' },
        { name: 'Sindhudurg', lat: 16.0833, lng: 73.4167, color: 'lawngreen' },
        { name: 'Thane', lat: 19.1973, lng: 72.9639, color: 'chartreuse' },
        { name: 'Raigad', lat: 18.7333, lng: 73.1333, color: 'limegreen' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'palegreen' },
        { name: 'Ahmednagar', lat: 19.0833, lng: 74.7333, color: 'seagreen' },
        { name: 'Dhule', lat: 20.9000, lng: 74.7833, color: 'mediumseagreen' },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2333, color: 'springgreen' },
        { name: 'Jalgaon', lat: 21.0167, lng: 75.5667, color: 'lawngreen' },
        { name: 'Dhule', lat: 20.9000, lng: 74.7833, color: 'chartreuse' },
        { name: 'Nashik', lat: 20.0000, lng: 73.7833, color: 'limegreen' },
        { name: 'Malegaon', lat: 20.5500, lng: 74.5333, color: 'palegreen' },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2333, color: 'seagreen' },
        { name: 'Jalgaon', lat: 21.0167, lng: 75.5667, color: 'mediumseagreen' },
        { name: 'Aurangabad', lat: 19.8773, lng: 75.3213, color: 'springgreen' },
        { name: 'Jalna', lat: 20.0333, lng: 75.8833, color: 'lawngreen' },
        { name: 'Parbhani', lat: 19.2667, lng: 76.7833, color: 'chartreuse' },
        { name: 'Hingoli', lat: 19.7167, lng: 77.1500, color: 'limegreen' },
        { name: 'Nanded', lat: 19.1333, lng: 77.3167, color: 'palegreen' },
        { name: 'Latur', lat: 18.4000, lng: 76.4667, color: 'seagreen' },
        { name: 'Osmanabad', lat: 18.1667, lng: 76.0667, color: 'mediumseagreen' },
        { name: 'Beed', lat: 18.9833, lng: 75.7500, color: 'springgreen' },
        { name: 'Solapur', lat: 17.6712, lng: 75.9077, color: 'lawngreen' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'chartreuse' },
        { name: 'Satara', lat: 17.6833, lng: 74.0333, color: 'limegreen' },
        { name: 'Sangli', lat: 16.8593, lng: 74.5639, color: 'palegreen' },
        { name: 'Kolhapur', lat: 16.6953, lng: 74.2439, color: 'seagreen' },
        { name: 'Ratnagiri', lat: 16.9833, lng: 73.3000, color: 'mediumseagreen' },
        { name: 'Sindhudurg', lat: 16.0833, lng: 73.4167, color: 'springgreen' },
        { name: 'Thane', lat: 19.1973, lng: 72.9639, color: 'lawngreen' },
        { name: 'Raigad', lat: 18.7333, lng: 73.1333, color: 'chartreuse' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'limegreen' },
        { name: 'Ahmednagar', lat: 19.0833, lng: 74.7333, color: 'palegreen' },
        { name: 'Dhule', lat: 20.9000, lng: 74.7833, color: 'seagreen' },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2333, color: 'mediumseagreen' },
        { name: 'Jalgaon', lat: 21.0167, lng: 75.5667, color: 'springgreen' },
        { name: 'Dhule', lat: 20.9000, lng: 74.7833, color: 'lawngreen' },
        { name: 'Nashik', lat: 20.0000, lng: 73.7833, color: 'chartreuse' },
        { name: 'Malegaon', lat: 20.5500, lng: 74.5333, color: 'limegreen' },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2333, color: 'palegreen' },
        { name: 'Jalgaon', lat: 21.0167, lng: 75.5667, color: 'seagreen' },
        { name: 'Aurangabad', lat: 22.8773, lng: 75.3213, color: 'mediumseagreen' },
        { name: 'Jalna', lat: 20.0333, lng: 75.8833, color: 'springgreen' },
        { name: 'Parbhani', lat: 19.2667, lng: 76.7833, color: 'lawngreen' },
        { name: 'Hingoli', lat: 19.7167, lng: 77.1500, color: 'chartreuse' },
        { name: 'Nanded', lat: 19.1333, lng: 77.3167, color: 'limegreen' },
        { name: 'Latur', lat: 18.4000, lng: 76.4667, color: 'palegreen' },
        { name: 'Osmanabad', lat: 18.1667, lng: 76.0667, color: 'seagreen' },
        { name: 'Beed', lat: 18.9833, lng: 75.7500, color: 'mediumseagreen' },
        { name: 'Solapur', lat: 17.6712, lng: 75.9077, color: 'springgreen' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'lawngreen' },
        { name: 'Satara', lat: 17.6833, lng: 74.0333, color: 'chartreuse' },
        { name: 'Sangli', lat: 16.8593, lng: 74.5639, color: 'limegreen' },
        { name: 'Kolhapur', lat: 16.6953, lng: 74.2439, color: 'palegreen' },
        { name: 'Ratnagiri', lat: 16.9833, lng: 73.3000, color: 'seagreen' },
        { name: 'Sindhudurg', lat: 16.0833, lng: 73.4167, color: 'mediumseagreen' },
        { name: 'Thane', lat: 19.1973, lng: 72.9639, color: 'springgreen' },
        { name: 'Raigad', lat: 18.7333, lng: 73.1333, color: 'lawngreen' },
        { name: 'Pune', lat: 18.5204, lng: 73.8568, color: 'chartreuse' },
        { name: 'Ahmednagar', lat: 19.0833, lng: 74.7333, color: 'limegreen' },
        { name: 'Dhule', lat: 20.9000, lng: 74.7833, color: 'palegreen' },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2333, color: 'seagreen' },
        { name: 'Jalgaon', lat: 21.0167, lng: 75.5667, color: 'mediumseagreen' },
        { name: 'Aurangabad', lat: 19.8773, lng: 75.3213, color: 'springgreen' },
        { name: 'Jalna', lat: 20.0333, lng: 75.8833, color: 'lawngreen' },
        { name: 'Parbhani', lat: 19.2667, lng: 76.7833, color: 'chartreuse' },
        { name: 'Jaipur', lat: 22.6708, lng: 71.5724, color: 'red' },
    ];

    // Find positions based on the state names
    const matchedPositions = positions.filter(pos =>
        stateNames?.map(name => typeof name === 'string' ? name.toLowerCase() : '').includes(pos.name.toLowerCase())
    );

    return (
        <MapContainer bounds={bounds} style={{ minHeight: '400px', width: '100%' }} zoom={2} zoomControl={false} attributionControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {matchedPositions.map(position => ( // Show markers for all matched positions
                <Marker key={position.name} position={[position.lat, position.lng]} icon={defaultIcon}>
                    <Popup>
                        {position.name}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
