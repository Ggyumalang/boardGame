import React from 'react';

const BadgeList = ({ badges }) => {
    if (!badges || badges.length === 0) {
        return (
            <div className="text-center py-lg text-secondary bg-gray-50 rounded-lg border border-border">
                아직 획득한 배지가 없습니다. 게임을 플레이하고 배지를 모아보세요!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-md">
            {badges.map(badge => (
                <div key={badge.id} className="bg-white p-md rounded-lg border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-sm">{badge.badge_icon}</div>
                    <h4 className="font-bold text-primary mb-xs">{badge.badge_name}</h4>
                    <p className="text-xs text-secondary">{badge.description}</p>
                    <div className="mt-sm text-xs text-gray-400">
                        {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BadgeList;
