import  { useState, useEffect } from 'react';
import { AlertCircle, Home, FileText,  MapPin, Calendar, Clock,  ChevronDown } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import IssueMap from '../components/IssueMap';

export interface Issue {
  id: string;
  title: string;
  description: string;
  image?: string; // optional if image not uploaded
  location: {
    latitude: number;
    longitude: number;
    address?: string; // optional
  };
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  userId: string;
}

interface FormData {
    title: string;
    description: string;
    image: File | null;
    imagePreview: string;
    issueType:string;
}

interface AuthorityInfo {
  authorityId: number;
  authorityName: string;
  category: string;
}
export default function AuthorityDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'my-issues'>('report');
    // @ts-ignore
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        issueType:''
    });
      // @ts-ignore
    const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
    // @ts-ignore
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
      // @ts-ignore
    const [formErrors, setFormErrors] = useState<any>({});
      // @ts-ignore
    const [isSubmitting, setIsSubmitting] = useState(false);
      // @ts-ignore
    const [allIssues, setAllIssues] = useState<Issue[]>([]);
      // @ts-ignore
    const [myIssues, setMyIssues] = useState<Issue[]>([]);
      const [authority, setAuthority] = useState<AuthorityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchAllIssues();
        fetchMyIssues();
    }, []);



 const fetchAllIssues = async () => {
  try {
    const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/');
    console.log('Sending request...');

    if (response.ok) {
      const data = await response.json();
      console.log("Raw data:", data);

      const issues: Issue[] = data.map((issue: any) => ({
        id: issue.id.toString(),
        title: issue.title,
        description: issue.description,
        image: issue.imageUrl || undefined,
        location: {
          latitude: issue.latitude || 29.22,
          longitude: issue.longitude || 79.52,
          address: issue.address || ''
        },
        status: issue.status.toLowerCase() as 'pending' | 'in-progress' | 'resolved',
        createdAt: issue.createdAt,
        userId: issue.userId.toString(),
      })).sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllIssues(issues);
    } else {
      console.error('Failed to fetch issues');
    }
  } catch (error) {
    console.error('Error fetching issues:', error);
  }
};
useEffect(() => {
  fetchAuthorityIssues();
}, []);
const fetchAuthorityIssues = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/authority', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch authority issues");
      return;
    }

    const data = await response.json();

    // Map data to Issue[] format
    const issues: Issue[] = data.map((issue: any) => ({
      id: issue.id.toString(),
      title: issue.title,
      description: issue.description,
      image: issue.imageUrl || undefined,
      location: {
        latitude: issue.latitude || 29.22,
        longitude: issue.longitude || 79.52,
        address: issue.address || ''
      },
      status: issue.status.toLowerCase() as 'pending' | 'in-progress' | 'resolved',
      createdAt: issue.createdAt,
      userId: issue.userId.toString(),
    }));

    setAllIssues(issues);
  } catch (err) {
    console.error("Error fetching authority issues:", err);
  }
};

const updateIssueStatus = async (issueId: string, newStatus: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/${issueId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update status");

  return data.issue;
};
useEffect(() => {
    const fetchAuthority = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }
        console.log("ran going -------------")
        const res = await fetch("http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("res---",res)
        const data = await res.json();

        if (res.ok) {
          setAuthority(data);
        } else {
          setError(data.error || "Failed to fetch authority info");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthority();
  }, []);
const fetchMyIssues = async () => {
  try {
    const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log("Response:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Raw data:", data);

      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const currentUserId = payload?.id?.toString();

      const userIssues: Issue[] = data
        .filter((issue: any) => issue.userId.toString() === currentUserId)
        .map((issue: any) => ({
          id: issue.id.toString(),
          title: issue.title,
          description: issue.description,
          image: issue.imageUrl || undefined,
          location: {
            latitude: issue.latitude || 29.22,
            longitude: issue.longitude || 79.52,
            address: issue.address || ''
          },
          status: issue.status.toLowerCase() as 'pending' | 'in-progress' | 'resolved',
          createdAt: issue.createdAt,
          userId: issue.userId.toString(),
        }))
        .sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      console.log("Filtered user issues:", userIssues);

      setMyIssues(userIssues);
    } else {
      console.error('Failed to fetch issues');
    }
  } catch (error) {
    console.error('Error fetching my issues:', error);
  }
};


    const getLocation = async (useMock = false) => {
        setIsLoadingLocation(true);

        if (useMock) {

            const latitude = 29.3826;
            const longitude = 79.5123;


            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await response.json();

            setLocation({
                latitude,
                longitude,
                address:
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.state ||
                    "Custom location",
            });

            setIsLoadingLocation(false);
            return;
        }


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                    );
                    const data = await response.json();
                    setLocation({
                        latitude,
                        longitude,
                        address:
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            data.address.state ||
                            "Detected location",
                    });
                    setIsLoadingLocation(false);
                },
                async (err) => {
                    console.error("Error:", err);
                    await getLocation();
                    setIsLoadingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            await getLocation();
            setIsLoadingLocation(false);
        }
    };






//     const handleSubmit = async () => {
//         const errors = validateForm();
//         if (Object.keys(errors).length > 0) {
//             setFormErrors(errors);
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('title', formData.title);
//             formDataToSend.append('description', formData.description);



//             if (formData.image) formDataToSend.append('image', formData.image);

//             if (location) {
//                 formDataToSend.append('latitude', location.latitude.toString());
//                 formDataToSend.append('longitude', location.longitude.toString());
//                 if (location.address) formDataToSend.append('address', location.address);
//             }

//             const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues', {
//                 method: 'POST',
//                 headers: {

//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: formDataToSend
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 alert('✅ Issue reported successfully!');
//                 console.log('Created issue:', data.issue);

//                 setFormData({
//                     title: '',
//                     description: '',
//                     image: null,
//                     imagePreview: '',
//                     issueType:''
// ,                })
//                 setLocation(null);
//                 setFormErrors({});
//                 fetchAllIssues();
//                 fetchMyIssues();
//                 setActiveTab('dashboard');
//             } else {
//                 alert(data.error || data.message || 'Failed to report issue');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Failed to connect to server');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredIssues = filterStatus === 'all'
        ? allIssues
        : allIssues.filter(issue => issue.status === filterStatus);



    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                            <AlertCircle className="text-white" size={20} />
                        </div>
                        <span className="text-lg font-bold text-green-500" >
                            NagarSeva
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Civic Issue Reporting Portal</p>
                </div>

                <nav className="p-3 space-y-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'dashboard'
                            ? 'bg-green-50 text-green-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 font-normal'
                            }`}
                    >
                        <Home size={18} />
                        <span>All Issues</span>
                    </button>

                </nav>

                <div className="absolute bottom-0 w-64 p-3 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </aside>


            <main className="flex-1 ml-64 p-6">


                {activeTab === 'dashboard' && (
                    <div>

                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">        {loading
          ? "Loading..."
          : authority?.authorityName || "Authority Dashboard"}
</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Browse and monitor civic issues reported by community members
                                </p>
                            </div>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <ChevronDown
                                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    size={16}
                                />
                            </div>
                        </div>


                       <div className='flex flex-col-reverse gap-2'>
                         <div className="flex flex-row flex-wrap gap-2  overflow-y-auto mt-4">
  {filteredIssues.length === 0 ? (
    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
      <FileText className="mx-auto text-gray-300 mb-3" size={40} />
      <p className="text-sm text-gray-600 font-medium">No issues found</p>
      <p className="text-xs text-gray-500 mt-1">
        Try adjusting your filters or check back later
      </p>
    </div>
  ) : (
    filteredIssues.map((issue) => (
      <div
        key={issue.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="md:flex">

          {issue.image ? (
            <div className="md:w-48  ">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 md:h-full object-fill"
              />
            </div>
          ) : (
            <div className="md:w-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}

        <div className="p-4 md:p-5 flex-1">
  <div className="flex items-start justify-between mb-2">
    <h3 className="text-base font-bold text-gray-900 leading-tight">
      {issue.title}
    </h3>


    <select
      value={issue.status || "pending"}
      onChange={async (e) => {
        const newStatus = e.target.value;
        try {
          const updatedIssue = await updateIssueStatus(issue.id, newStatus);

          setAllIssues((prev) =>
            prev.map((i) => (i.id === issue.id ? updatedIssue : i))
          );
          setMyIssues((prev) =>
            prev.map((i) => (i.id === issue.id ? updatedIssue : i))
          );
        } catch (err: any) {
          alert(err.message || "Failed to update status");
        }
      }}
      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(issue.status || "pending")}`}
    >
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="resolved">Resolved</option>
    </select>
  </div>

  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
    {issue.description}
  </p>


  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
    <div className="flex items-center space-x-1">
      <MapPin size={14} className="flex-shrink-0" />
      <span className="truncate max-w-xs">
        {issue.createdAt || "Location captured"}
      </span>
    </div>
    <div className="flex items-center space-x-1">
      <Calendar size={14} className="flex-shrink-0" />
      <span>{formatDate(issue.createdAt)}</span>
    </div>
    <div className="flex items-center space-x-1">
      <Clock size={14} className="flex-shrink-0" />
      <span>{formatTime(issue.createdAt)}</span>
    </div>
  </div>
</div>

        </div>
      </div>
    ))
  )}
</div>
                        <IssueMap issues={allIssues} />
                       </div>
                    </div>
                )}
            </main>
        </div>
    );
}