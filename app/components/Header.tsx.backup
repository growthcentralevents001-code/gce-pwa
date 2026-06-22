"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import HeaderEventSearch from "@/components/HeaderEventSearch";
import { 
  Menu, X, ChevronDown, LogOut, User, Building, Link as LinkIcon, 
  PlusCircle, Heart, Info, FileText, Shield, Mail, LayoutDashboard, 
  Settings, UsersRound, BriefcaseMedical 
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, approved')
          .eq('user_id', user.id)
          .eq('approved', true);
        if (!error && data) {
          setRoles(data.map(r => ({ role: r.role })));
          const storedRole = localStorage.getItem('activeRole');
          if (storedRole && data.some(r => r.role === storedRole)) {
            setActiveRole(storedRole);
          } else if (data.length > 0) {
            setActiveRole(data[0].role);
            localStorage.setItem('activeRole', data[0].role);
          }
        }
      }
      setLoading(false);
    };
    fetchUserAndRoles();
  }, []);

  const handleSetActiveRole = (role) => {
    setActiveRole(role);
    localStorage.setItem('activeRole', role);
    const roleMap = {
      member: '/dashboard/member',
      venue: '/dashboard/venue',
      affiliate: '/dashboard/affiliate',
      zbp: '/dashboard/zbp',
      bdm: '/dashboard/bdm',
      enterprise: '/dashboard/enterprise',
      admin: '/admin',
    };
    const path = roleMap[role];
    if (path) window.location.href = path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const roleLabels = {
    member: "Member",
    venue: "Venue Partner",
    affiliate: "Affiliate",
    zbp: "ZBP",
    bdm: "BDM",
    enterprise: "Enterprise",
    admin: "Admin",
  };

  const roleIcons = {
    member: <User size={16} />,
    venue: <Building size={16} />,
    affiliate: <LinkIcon size={16} />,
    zbp: <UsersRound size={16} />,
    bdm: <BriefcaseMedical size={16} />,
    enterprise: <Building size={16} />,
    admin: <Shield size={16} />,
  };

  const getAvatarLetter = () => {
    if (!user) return "?";
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setMenuOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <Link href="/" className="text-2xl font-bold text-orange-600">GCE</Link>
        </div>
        <div className="flex-1 max-w-md">
          <HeaderEventSearch />
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/events" className="text-gray-600 hover:text-orange-600 hidden sm:block">Events</Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                  {getAvatarLetter()}
                </div>
                <span className="text-sm font-medium">{user.email?.split("@")[0]}</span>
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b">Signed in as<br/>{user.email}</div>
                    {!loading && roles.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500">Your dashboards</div>
                        {roles.map(role => (
                          <button key={role.role} onClick={() => { handleSetActiveRole(role.role); setDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${activeRole === role.role ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"}`}>
                            {roleIcons[role.role] || <User size={16} />}
                            <span>{roleLabels[role.role] || role.role}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!loading && roles.length === 0 && <div className="py-2 px-3 text-sm text-gray-500">No approved roles</div>}
                    <hr className="my-1" />
                    <Link href="/apply/role" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setDropdownOpen(false)}>
                      <PlusCircle size={16} /> Apply for new role
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-orange-600">Login</Link>
              <Link href="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-end"><button onClick={() => setMenuOpen(false)}><X size={24} /></button></div>
            <div className="mt-4 space-y-2">
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><User size={20} /> Profile</Link>
              <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><Settings size={20} /> Settings</Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><LayoutDashboard size={20} /> Dashboard</Link>
              <hr className="my-2" />
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><Heart size={20} /> Wishlist</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><Info size={20} /> About</Link>
              <Link href="/terms" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><FileText size={20} /> Terms</Link>
              <Link href="/privacy" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><Shield size={20} /> Privacy</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"><Mail size={20} /> Contact</Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
