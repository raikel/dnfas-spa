const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    videos: state => state.videos.items,
    videosCount: state => state.videos.count,
    subjects: state => state.subjects.items,
    subjectsCount: state => state.subjects.count,
    cameras: state => state.cameras.items,
    camerasCount: state => state.cameras.count,
    stats: state => state.stats.items
};

export default getters;

