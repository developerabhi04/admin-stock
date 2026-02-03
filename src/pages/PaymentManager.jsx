import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, TrendingDown, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import PendingPayments from './PendingPayments';
import PendingWithdrawals from './PendingWithdrawals';
import PageHeader from './paymentmanager/PageHeader';
import StatCard from './paymentmanager/StatCard';
import TabButton from './paymentmanager/TabButton';


const PaymentManager = ({ defaultTab = 'payments' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get counts from Redux store
    const { payments } = useSelector((state) => state.payments);
    const { withdrawals } = useSelector((state) => state.withdrawals);

    // Determine initial tab from URL
    const getInitialTab = () => {
        if (location.pathname.includes('withdrawals')) return 'withdrawals';
        if (location.pathname.includes('payments')) return 'payments';
        return defaultTab;
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    // Sync tab with URL
    useEffect(() => {
        const newTab = getInitialTab();
        setActiveTab(newTab);
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/dashboard/payment-manager/${tab}`, { replace: true });
    };

    // Statistics configuration
    const statistics = [
        {
            id: 'pending-payments',
            title: 'Pending Payments',
            value: payments?.length || 0,
            icon: CreditCard,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
        },
        {
            id: 'pending-withdrawals',
            title: 'Pending Withdrawals',
            value: withdrawals?.length || 0,
            icon: TrendingDown,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
        },
        {
            id: 'total-pending',
            title: 'Total Pending',
            value: (payments?.length || 0) + (withdrawals?.length || 0),
            icon: Clock,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
        },
    ];

    // Tabs configuration
    const tabs = [
        {
            id: 'payments',
            label: 'Payments',
            icon: CreditCard,
            component: PendingPayments,
            count: payments?.length || 0,
        },
        {
            id: 'withdrawals',
            label: 'Withdrawals',
            icon: TrendingDown,
            component: PendingWithdrawals,
            count: withdrawals?.length || 0,
        },
    ];

    const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Payment Manager"
                subtitle="Manage all payment and withdrawal requests"
            />

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statistics.map((stat) => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                isActive={activeTab === tab.id}
                                onClick={() => handleTabChange(tab.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
};

export default PaymentManager;
