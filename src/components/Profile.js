import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Globe } from 'lucide-react';
import { Country, City } from 'country-state-city';
import SearchableSelect from './SearchableSelect';

function Profile() {
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState({
    name: '',
    phone: '',
    country: '',
    city: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name || '',
        phone: authUser.phone || '',
        country: authUser.country || '',
        city: authUser.city || '',
      });
      
      // Set selected country for cities dropdown
      if (authUser.country) {
        const country = Country.getAllCountries().find(
          c => c.name === authUser.country
        );
        setSelectedCountry(country);
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (selectedCountry) {
      setCities(City.getCitiesOfCountry(selectedCountry.isoCode) || []);
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.name === e.target.value);
    setSelectedCountry(country);
    setUser(prev => ({
      ...prev,
      country: country.name,
      city: '', // Reset city when country changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        user,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      login(response.data.user, localStorage.getItem('token'));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User size={20} className="mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Phone size={20} className="mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={user.phone || ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Globe size={20} className="mr-2" />
                  Country
                </label>
                {isEditing ? (
                  <SearchableSelect
                    value={user.country}
                    onChange={handleCountryChange}
                    options={countries}
                    placeholder="Select a country"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.country || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin size={20} className="mr-2" />
                  City
                </label>
                {isEditing ? (
                  <SearchableSelect
                    value={user.city}
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    disabled={!selectedCountry}
                    options={cities}
                    placeholder={selectedCountry ? "Select a city" : "Select a country first"}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.city || 'Not set'}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile; 