import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Upload, X, ImageIcon } from 'lucide-react';
import { adminAPI } from '../services/api';
import PageHeader from '../pages/paymentmanager/PageHeader';
import Loading from '../components/Loader';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            console.log('🔵 Fetching banners...');

            const response = await adminAPI.getAllBanners();
            console.log('✅ Response:', response);
            console.log('✅ Response data:', response.data);
            console.log('✅ Banners:', response.data.data.banners);

            // ✅ Check if banners exist
            if (response.data && response.data.data && response.data.data.banners) {
                setBanners(response.data.data.banners);
                console.log('✅ Banners set:', response.data.data.banners.length);
            } else {
                console.warn('⚠️ No banners in response');
                setBanners([]);
            }
        } catch (error) {
            console.error('❌ Error fetching banners:', error);
            console.error('❌ Error response:', error.response);
            alert('Failed to fetch banners: ' + (error.response?.data?.message || error.message));
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };


    // ✅ Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // ✅ Handle upload
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select an image file');
            return;
        }

        try {
            setUploading(true);

            // Create FormData
            const formData = new FormData();
            formData.append('banner', selectedFile);

            await adminAPI.uploadBanner(formData);

            alert('Banner uploaded successfully!');
            setShowModal(false);
            resetForm();
            fetchBanners();
        } catch (error) {
            console.error('Error uploading banner:', error);
            alert(error.response?.data?.message || 'Failed to upload banner');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            await adminAPI.deleteBanner(id);
            alert('Banner deleted successfully!');
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Failed to delete banner');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await adminAPI.toggleBannerStatus(id);
            fetchBanners();
        } catch (error) {
            console.error('Error toggling banner status:', error);
            alert('Failed to update banner status');
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const getImageUrl = (imageUrl) => {
        // ✅ Construct full URL for images
        return `http://localhost:5000${imageUrl}`;
    };

    if (loading) {
        return <Loading message="Loading Banner..." />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Banner Management"
                subtitle={`Manage promotional banners for mobile app (${banners.length} banners)`}
            />

            {/* Stats & Upload Button */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex gap-6">
                    <div>
                        <p className="text-sm text-gray-600">Total Banners</p>
                        <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Active Banners</p>
                        <p className="text-2xl font-bold text-green-600">
                            {banners.filter(b => b.isActive).length}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Upload Banner
                </button>
            </div>

            {/* Banners Grid */}
            {banners.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners uploaded yet</h3>
                    <p className="text-gray-600 mb-4">Upload your first banner to get started</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Upload Banner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner, index) => (
                        <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            {/* Banner Image */}
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={getImageUrl(banner.imageUrl)}
                                    alt={`Banner ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                                    }}
                                />

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        Order: {banner.order}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(banner.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(banner._id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${banner.isActive
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {banner.isActive ? (
                                            <>
                                                <EyeOff size={16} />
                                                <span className="text-sm">Hide</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye size={16} />
                                                <span className="text-sm">Show</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(banner._id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition"
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-sm">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Upload Banner</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            {/* File Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Banner Image
                                </label>

                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                                                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                </div>

                                {selectedFile && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Upload Banner
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
