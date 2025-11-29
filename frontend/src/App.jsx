import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";

export default function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    dateTime: "",
    artist: "",
    address: "",
    description: "",
  });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4030/events");
        setEvents(res.data);
      } catch (err) {
        console.log(err?.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4030/events", form);
      setEvents((prev) => [...prev, res.data]);
      setForm({
        title: "",
        dateTime: "",
        artist: "",
        address: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:4030/events/${id}`);
      setEvents((prev) => prev.filter((ele) => ele._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Events Manager</h1>
            <p className="text-sm text-gray-500">
              Add events and view them on the map
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 p-2"
                  placeholder="Event title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date & time
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-300 p-2"
                  value={form.dateTime}
                  onChange={(e) =>
                    setForm({ ...form, dateTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Artist
                </label>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-300 p-2"
                  placeholder="Artist / performer"
                  value={form.artist}
                  onChange={(e) => setForm({ ...form, artist: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-300 p-2"
                  placeholder="Venue address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2 h-24"
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      title: "",
                      dateTime: "",
                      artist: "",
                      address: "",
                      description: "",
                    })
                  }
                  className="inline-flex items-center justify-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: List + Map */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Events</h3>
                <div className="text-sm text-gray-500">
                  Total: {events.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                      <th className="py-2 px-3 border-b">Artist</th>
                      <th className="py-2 px-3 border-b">Title</th>
                      <th className="py-2 px-3 border-b">Address</th>
                      <th className="py-2 px-3 border-b">Date</th>
                      <th className="py-2 px-3 border-b">Latitude</th>
                      <th className="py-2 px-3 border-b">Longitude</th>
                      <th className="py-2 px-3 border-b">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : events.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-gray-500"
                        >
                          No events yet.
                        </td>
                      </tr>
                    ) : (
                      events.map((ele, i) => (
                        <tr key={ele._id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 border-b">{ele.artist}</td>
                          <td className="py-2 px-3 border-b">{ele.title}</td>
                          <td className="py-2 px-3 border-b">{ele.address}</td>
                          <td className="py-2 px-3 border-b whitespace-nowrap">
                            {ele.dateTime
                              ? new Date(ele.dateTime).toLocaleString()
                              : ""}
                          </td>
                          <td className="py-2 px-3 border-b">
                            {ele.geo?.lat ?? "-"}
                          </td>
                          <td className="py-2 px-3 border-b">
                            {ele.geo?.long ?? "-"}
                          </td>
                          <td className="py-2 px-3 border-b">
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                                onClick={() => setSelected(ele)}
                              >
                                View
                              </button>
                              <button
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                onClick={() => handleDelete(ele._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Small inline map preview (optional) */}
            {selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setSelected(null)}
                />
                <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selected.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(null)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div style={{ height: 480 }} className="w-full">
                    <MapContainer
                      // using key forces a full remount when selected changes
                      key={`${selected._id}-${selected.geo?.lat}-${selected.geo?.long}`}
                      center={[
                        Number(selected.geo?.lat ?? 0),
                        Number(selected.geo?.long ?? 0),
                      ]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                      whenCreated={(map) => {
                        // delay to ensure modal has fully transitioned
                        setTimeout(() => {
                          map.invalidateSize();
                        }, 100);
                      }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[
                          Number(selected.geo?.lat ?? 0),
                          Number(selected.geo?.long ?? 0),
                        ]}
                      >
                        <Popup>
                          <div>
                            <strong>{selected.title}</strong>
                            <div>{selected.address}</div>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelected(null)}
            />
            <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selected.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div style={{ height: 480 }} className="w-full">
                <MapContainer
                  center={[selected.geo?.lat ?? 0, selected.geo?.long ?? 0]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[selected.geo?.lat ?? 0, selected.geo?.long ?? 0]}
                  >
                    <Popup>
                      <div>
                        <strong>{selected.title}</strong>
                        <div>{selected.address}</div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
