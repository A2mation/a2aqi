export const deviceDefaultSelect = {
    id: true,
    name: true,
    serialNo: true,
    isActive: true,
    status: true,
    lat: true,
    lng: true,
    assignedAt: true,
    createdAt: true,
    updatedAt: true,

    model: {
        select: {
            id: true,
            name: true,
            manufacturer: true,
        },
    },
};
