import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import './App.css';

const GITHUB_USERNAME = 'Praveen7805';
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#ef4444'];

export default function App() {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      const userData = await userRes.json();
      setUserData(userData);

      // Fetch repos
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=20`);
      const reposData = await reposRes.json();
      setRepos(reposData);

      // Calculate languages
      let langCounts = {};
      for (let repo of reposData) {
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      }
      setLanguages(langCounts);
    } catch (err) {
      setError('Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4 font-semibold">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchGitHubData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const languageData = Object.entries(languages).map(([lang, count]) => ({
    name: lang,
    value: count
  })).sort((a, b) => b.value - a.value);

  const topRepos = repos.slice(0, 8).map(repo => ({
    name: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url
  }));

  const stats = [
    { label: 'Followers', value: userData.followers, icon: '👥', color: 'from-blue-400 to-blue-600' },
    { label: 'Following', value: userData.following, icon: '🔗', color: 'from-purple-400 to-purple-600' },
    { label: 'Repositories', value: userData.public_repos, icon: '📚', color: 'from-pink-400 to-pink-600' },
    { label: 'Gists', value: userData.public_gists, icon: '📝', color: 'from-green-400 to-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GitHub Analytics
          </h1>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-8 mb-8">
            <img
              src={userData.avatar_url}
              alt={userData.login}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl"
            />
            <div>
              <h2 className="text-5xl font-bold mb-2">{userData.name || userData.login}</h2>
              <p className="text-xl text-blue-100 mb-4">@{userData.login}</p>
              {userData.bio && <p className="text-lg text-blue-50">{userData.bio}</p>}
              {userData.location && <p className="text-blue-100 mt-2">📍 {userData.location}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-8 text-white shadow-lg hover:shadow-2xl transition-shadow`}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-white/80 font-medium mb-2">{stat.label}</p>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Repos Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">⭐ Top Repositories</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topRepos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b' }}
                />
                <Legend />
                <Bar dataKey="stars" fill="#3b82f6" name="Stars" radius={[8, 8, 0, 0]} />
                <Bar dataKey="forks" fill="#8b5cf6" name="Forks" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Languages Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">💻 Languages Used</h3>
            {languageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}`}
                    outerRadius={100}
                    fill="#3b82f6"
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    labelStyle={{ color: '#1e293b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-12">No language data available</p>
            )}
          </div>
        </div>

        {/* Language Stats List */}
        {languageData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Language Breakdown</h3>
            <div className="space-y-4">
              {languageData.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                  <span className="font-medium text-slate-900 min-w-32">{lang.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(lang.value / languageData.reduce((a, b) => a + b.value, 0)) * 100}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    ></div>
                  </div>
                  <span className="text-slate-600 font-medium">{lang.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Repositories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">📦 All Repositories</h3>
          <div className="space-y-4">
            {repos.map((repo, idx) => (
              <a
                key={idx}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-blue-600 group-hover:text-blue-700">→ {repo.name}</h4>
                  <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full">{repo.created_at.split('T')[0]}</span>
                </div>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {repo.description || 'No description provided'}
                </p>
                <div className="flex gap-4 text-sm text-slate-600 flex-wrap">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🔄 {repo.forks_count}</span>
                  {repo.topics?.length > 0 && (
                    <span className="flex gap-2">
                      {repo.topics.slice(0, 2).map(topic => (
                        <span key={topic} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2026 GitHub Analytics Dashboard | Built with React + Recharts + Tailwind</p>
        </div>
      </footer>
    </div>
  );
}