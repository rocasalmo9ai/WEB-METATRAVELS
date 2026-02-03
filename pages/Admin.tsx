
import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, FileText, Settings, LogOut, Plus } from 'lucide-react';
import { MOCK_LEADS, PACKAGES } from '../constants';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';

const CustomCheckIcon = ({className}: {className?:string}) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'packages' | 'leads'>('dashboard');
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Meta<span className="text-accent">Admin</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> {t.admin.dashboard}
          </button>
          <button onClick={() => setActiveTab('packages')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'packages' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Package className="w-5 h-5 mr-3" /> {t.admin.packages}
          </button>
          <button onClick={() => setActiveTab('leads')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Users className="w-5 h-5 mr-3" /> {t.admin.leads}
          </button>
          <button className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <FileText className="w-5 h-5 mr-3" /> {t.admin.blog}
          </button>
          <button className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <Settings className="w-5 h-5 mr-3" /> {t.admin.settings}
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center px-4 py-2 text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5 mr-3" /> {t.admin.logout}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{t.admin.summary}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm uppercase">{t.admin.newLeads}</p>
                <p className="text-4xl font-bold text-primary mt-2">12</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm uppercase">{t.admin.activePackages}</p>
                <p className="text-4xl font-bold text-accent mt-2">{PACKAGES.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm uppercase">{t.admin.conversion}</p>
                <p className="text-4xl font-bold text-green-600 mt-2">4.5%</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">{t.admin.seoCheck}</h3>
              <div className="space-y-3">
                 <div className="flex items-center text-sm text-green-600"><CustomCheckIcon className="w-4 h-4 mr-2"/> Sitemap.xml generado</div>
                 <div className="flex items-center text-sm text-green-600"><CustomCheckIcon className="w-4 h-4 mr-2"/> Robots.txt configurado</div>
                 <div className="flex items-center text-sm text-yellow-600"><div className="w-4 h-4 mr-2 rounded-full border border-yellow-600 flex items-center justify-center text-[10px]">!</div> 2 Paquetes sin Meta Description</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">{t.admin.packageMgmt}</h1>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="w-4 h-4 mr-2" /> {t.admin.newPackage}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">{t.admin.table.title}</th>
                    <th className="px-6 py-4">{t.admin.table.dest}</th>
                    <th className="px-6 py-4">{t.admin.table.price}</th>
                    <th className="px-6 py-4">{t.admin.table.status}</th>
                    <th className="px-6 py-4">{t.admin.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PACKAGES.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{pkg.title.es}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.destination.es}</td>
                      <td className="px-6 py-4 text-gray-600">${pkg.price} {pkg.currency}</td>
                      <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{t.admin.table.published}</span></td>
                      <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{t.admin.table.edit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
           <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{t.admin.leadsTitle}</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">{t.admin.tableLeads.date}</th>
                    <th className="px-6 py-4">{t.admin.tableLeads.name}</th>
                    <th className="px-6 py-4">{t.admin.tableLeads.dest}</th>
                    <th className="px-6 py-4">{t.admin.tableLeads.status}</th>
                    <th className="px-6 py-4">{t.admin.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_LEADS.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600">{lead.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {lead.name}<br/>
                        <span className="text-xs text-gray-500">{lead.email}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{lead.destination}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${lead.status === 'Nuevo' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{t.admin.table.viewDetail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </div>
        )}

      </main>
    </div>
  );
};
