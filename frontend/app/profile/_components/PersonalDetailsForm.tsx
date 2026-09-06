"use client";

import { motion } from "framer-motion";
import { User as UserIcon, MapPin, Save, Phone, Home, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function PersonalDetailsForm() {
  const { user, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [successPersonal, setSuccessPersonal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [successAddress, setSuccessAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipCode(user.zip_code || "");
      setCountry(user.country || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    setSuccessPersonal(false);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      setSuccessPersonal(true);
      setTimeout(() => setSuccessPersonal(false), 3000);
    } catch (error) {
      console.error("Error updating personal details:", error);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setSuccessAddress(false);
    try {
      await updateProfile({
        address: address,
        city: city,
        state: state,
        zip_code: zipCode,
        country: country,
      });
      setSuccessAddress(true);
      setTimeout(() => setSuccessAddress(false), 3000);
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal Details Div */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
      >
        <header className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Personal Details</h3>
            <p className="text-sm text-foreground-secondary font-light">
              Manage your contact and personal information
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
            <UserIcon size={20} />
          </div>
        </header>

        <form onSubmit={handlePersonalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] opacity-50 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
                />
                <Phone
                  size={16}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-4 border-t border-border/50">
            <button
              type="submit"
              disabled={savingPersonal}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {savingPersonal ? "Saving..." : "Save Personal Details"}
            </button>
            {successPersonal && (
              <span className="text-sm text-green-600 font-medium animate-fade-in">
                Personal details saved successfully!
              </span>
            )}
          </div>
        </form>
      </motion.div>

      {/* 2. Saved Address Div */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
      >
        <header className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Saved Address</h3>
            <p className="text-sm text-foreground-secondary font-light">
              Manage your default shipping address
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
            <MapPin size={20} />
          </div>
        </header>

        <form onSubmit={handleAddressSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
              htmlFor="address"
            >
              Street Address
            </label>
            <div className="relative">
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Apple Park Way"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
              />
              <Home
                size={16}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cupertino"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="state"
              >
                State / Province
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
                htmlFor="zipCode"
              >
                ZIP / Postal Code
              </label>
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="95014"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
              htmlFor="country"
            >
              Country
            </label>
            <div className="relative">
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
              />
              <Globe
                size={16}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center gap-4 border-t border-border/50">
            <button
              type="submit"
              disabled={savingAddress}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {savingAddress ? "Saving..." : "Save Address"}
            </button>
            {successAddress && (
              <span className="text-sm text-green-600 font-medium animate-fade-in">
                Address saved successfully!
              </span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
