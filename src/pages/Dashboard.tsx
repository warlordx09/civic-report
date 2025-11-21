import React, { useState, useEffect } from 'react';
import { AlertCircle, Home, FileText, PlusCircle, MapPin, Camera,  X, Calendar, Clock, ChevronDown } from 'lucide-react';

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

export default function Dashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'my-issues'>('report');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        issueType:''
    });
    const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allIssues, setAllIssues] = useState<Issue[]>([]);
    const [myIssues, setMyIssues] = useState<Issue[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchAllIssues();
        fetchMyIssues();
    }, []);

    const handleDeleteIssue = async (id: any) => {
        if (!window.confirm('Are you sure you want to delete this issue?')) return;

        try {
            const response = await fetch(`http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert('Issue deleted successfully');
                setMyIssues((prev) => prev.filter((issue) => issue.id !== id));
                fetchMyIssues();
            } else {
                alert(data.error || 'Failed to delete issue');
            }
        } catch (err) {
            console.error('Error deleting issue:', err);
            alert('Server error');
        }
    };

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
          latitude: issue.latitude || 29.22,  // default near Haldwani
          longitude: issue.longitude || 79.52, // default near Haldwani
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
const handleClassify = async () => {
    if (!formData.image) {
        alert("Please upload an image before classification.");
        return;
    }

    try {
        console.log("working")
        const dataToSend = new FormData();
        dataToSend.append("image", formData.image);

        const response = await fetch("http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues/classify", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: dataToSend,
        });

        const result = await response.json();
        console.log("pokoe",result)
        if (response.ok) {
            setFormData(prev => ({
                ...prev,
                title: result.title ,
                description: result.description || "",
                issueType:result.category
            }));

        } else {
            alert(result.error || "Failed to classify the image");
        }
    } catch (err) {
        console.error("Classification error:", err);
        alert("Error classifying the image. Try again.");
    }
};



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
                    // fallback to IP if needed
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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageData = reader.result as string;

            try {
                // const exifData = await exifr.parse(file);
                // const dateTaken = exifData?.DateTimeOriginal;

                // if (dateTaken) {
                //     const now = new Date();
                //     const diffHours = Math.abs(now.getTime() - dateTaken.getTime()) / 36e5;
                //     if (diffHours > 24) {
                //         alert("⚠️ This photo seems older than 24 hours.");
                //         return;
                //     }
                // } else {
                //     alert("⚠️ Could not verify photo date. Please use your camera to take a new photo.");
                //     return;
                // }

                setFormData(prev => ({ ...prev, image: file, imagePreview: imageData }));
            } catch (err) {
                console.error("Error reading EXIF:", err);
                alert("Could not read photo metadata. Try using a recent photo.");
            }
        };

        reader.readAsDataURL(file);
    };
    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null, imagePreview: '' }));
    };

    const validateForm = () => {
        const errors: any = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.image) errors.image = 'Image is required';
        if (!location) errors.location = 'Location is required';
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);


            if (formData.image) formDataToSend.append('image', formData.image);


            if (location) {
                formDataToSend.append('latitude', location.latitude.toString());
                formDataToSend.append('longitude', location.longitude.toString());
                if (location.address) formDataToSend.append('address', location.address);
            }

            const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/issues', {
                method: 'POST',
                headers: {

                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ Issue reported successfully!');
                console.log('Created issue:', data.issue);

                setFormData({
                    title: '',
                    description: '',
                    image: null,
                    imagePreview: '',
                    issueType:''
,                })
                setLocation(null);
                setFormErrors({});
                fetchAllIssues();
                fetchMyIssues();
                setActiveTab('dashboard');
            } else {
                alert(data.error || data.message || 'Failed to report issue');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server');
        } finally {
            setIsSubmitting(false);
        }
    };


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

    const filteredMyIssues = filterStatus === 'all'
        ? myIssues
        : myIssues.filter(issue => issue.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">

            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                            <AlertCircle className="text-white" size={20} />
                        </div>
                        <span className="text-lg font-bold text-orange-500" >
                            NagarSeva
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Civic Issue Reporting Portal</p>
                </div>

                <nav className="p-3 space-y-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'dashboard'
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 font-normal'
                            }`}
                    >
                        <Home size={18} />
                        <span>All Issues</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('report')}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'report'
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 font-normal'
                            }`}
                    >
                        <PlusCircle size={18} />
                        <span>Report New Issue</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('my-issues')}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'my-issues'
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 font-normal'
                            }`}
                    >
                        <FileText size={18} />
                        <span>My Reported Issues</span>
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

                {activeTab === 'report' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Report Civic Issue</h2>
                            <p className="text-sm text-gray-600 mt-1">Provide detailed information about the civic issue in your area</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="space-y-5">
                                <div>
                                    <div className='flex justify-between'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Issue Title <span className="text-red-500">*</span>
                                    </label>
                                    <span className='text-sm text-sky-400 pr-2 font-normal cursor-pointer'
                                    onClick={handleClassify}
                                    >Fill with AI</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, title: e.target.value }));
                                            if (formErrors.title) setFormErrors((prev: any) => ({ ...prev, title: '' }));
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Brief title describing the issue (e.g., Large pothole on Main Street)"
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Detailed Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, description: e.target.value }));
                                            if (formErrors.description) setFormErrors((prev: any) => ({ ...prev, description: '' }));
                                        }}
                                        rows={5}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Provide a detailed description of the issue, including when you noticed it, severity, and any other relevant information..."
                                    />
                                    {formErrors.description && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Be as specific as possible to help authorities understand and resolve the issue quickly</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Upload Photo Evidence <span className="text-red-500">*</span>
                                    </label>
                                    {!formData.imagePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                                            <Camera className="text-gray-400 mb-2" size={32} />
                                            <span className="text-sm text-gray-600 font-medium">Click to upload photo</span>
                                            <span className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (Max 10MB)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="w-full h-56 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {formErrors.image && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Clear photos help authorities assess the issue accurately</p>
                                </div>
 <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Issue Type <span className="text-red-500">*</span>
                                    </label>
                                   <div className='flex gap-4'>
                                     <input
                                        type="text"
                                        disabled
                                        value={formData.issueType}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, issueType: e.target.value }));
                                            if (formErrors.issueType) setFormErrors((prev: any) => ({ ...prev, issueType: '' }));
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Brief title describing the issue (e.g., Large pothole on Main Street)"
                                    />

                                   </div>
                                    {formErrors.title && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Issue Location <span className="text-red-500">*</span>
                                    </label>
                                    {!location ? (
                                        <button
                                            type="button"
                                            onClick={() => getLocation()}
                                            disabled={isLoadingLocation}
                                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            <MapPin size={18} className="text-gray-400" />
                                            <span className="text-gray-600 font-medium">
                                                {isLoadingLocation ? 'Detecting your location...' : 'Capture Current Location'}
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <MapPin className="text-green-600 mt-0.5" size={18} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-green-900">Location Successfully Captured</p>
                                                <p className="text-xs text-green-700 mt-1 leading-relaxed">
                                                    {location.address || `Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setLocation(null)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {formErrors.location && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">We use your location to route the issue to the correct department</p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting Report...' : 'Submit Issue Report'}
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-2">Your report will be reviewed and forwarded to the relevant authorities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'dashboard' && (
                    <div>

                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Community Issue Reports</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Browse and monitor civic issues reported by community members
                                </p>
                            </div>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
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
          {/* Image */}
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

          {/* Text Content */}
          <div className="p-4 md:p-5 flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {issue.title}
              </h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(
                  issue.status || "pending"
                )}`}
              >
                {(issue.status || "pending").replace("-", " ")}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
              {issue.description}
            </p>

            {/* Metadata */}
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

                {activeTab === 'my-issues' && (
                    <div>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">My Issue Reports</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Track and manage the issues you’ve reported
                                </p>
                            </div>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
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

                        <div className="grid gap-4">
                            {filteredMyIssues.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                                    <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-sm text-gray-600 font-medium mb-1">
                                        No issues reported yet
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Start contributing by reporting civic issues in your area
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('report')}
                                        className="px-5 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        Report Your First Issue
                                    </button>
                                </div>
                            ) : (
                                filteredMyIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="md:flex">
                                            <div className="md:w-64 flex-shrink-0">
                                                <img
                                                    src={issue.image || '/placeholder.jpg'}
                                                    alt={issue.title}
                                                    className="w-full h-48 md:h-full object-cover"
                                                />
                                            </div>

                                            <div className="p-4 md:p-5 flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                                                        {issue.title}
                                                    </h3>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(
                                                            issue.status || 'pending'
                                                        )}`}
                                                    >
                                                        {(issue.status || 'pending').replace('-', ' ')}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                                    {issue.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin size={14} className="flex-shrink-0" />
                                                        <span className="truncate max-w-xs">
                                                            {issue.createdAt || 'Location captured'}
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

                                                <button
                                                    onClick={() => handleDeleteIssue(issue.id)}
                                                    className="text-red-500 text-sm font-medium hover:underline"
                                                >
                                                    Delete Issue
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}