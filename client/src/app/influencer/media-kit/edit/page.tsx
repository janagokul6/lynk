'use client';

import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function EditMediaKit() {
  const [autoSync, setAutoSync] = useState(true);

  return (
    <AppLayout variant="influencer" activeTab="Profile" hideBottomNav={true}>
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 flex flex-col gap-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 border-b border-slate-200 dark:border-white/5 mx-[-1rem] px-[1rem] lg:mx-0 lg:px-4">
          <div className="flex items-center h-12 justify-between">
            <button className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Icon name="arrow_back" size={24} />
            </button>
            <div className="flex items-center gap-4">
              <button
                aria-label="Preview"
                className="text-slate-500 dark:text-[#9db0b9] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Icon name="visibility" size={24} />
              </button>
              <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-primary/20 transition-all">
                Save
              </button>
            </div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight px-1">Edit Media Kit</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col pb-24">
          {/* Profile Section */}
          <div className="flex py-4 flex-col gap-6">
            <div className="flex w-full flex-row gap-5 items-start">
              <div className="relative group cursor-pointer shrink-0">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-2xl h-28 w-28 shadow-lg ring-2 ring-white/5"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI6VM-wCMTgdXj81ZCXc-pgIaMo_lEHccKDcLSDCtb0xdFQTYiAIQaz_lughP6dC_dA3dw8TFQ8lvXek6mXBjET_DsWSWZ499wVlYIl9as0kuuusERK72TfbsigUC8Uz2NP4-XgY_3Pw1ZM_MXBE8YzZ6eqrrRlVr2lJK1BWcCl-YIzoHpeAPGjnrm_XaGZ_0KwD0fizd8AyuZsoQEo8P2qTJ2y9dAyx94aTOlH3MCD3VxbZbr2cSsgcewnDGi51y74ZWVIlTohzk')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="edit" className="text-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1 pt-1">
                <input
                  className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-white/20 focus:border-primary text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] w-full focus:outline-none focus:ring-0 px-0 transition-colors mb-1 placeholder-slate-400 dark:placeholder-white/30"
                  placeholder="Display Name"
                  type="text"
                  defaultValue="Alex Creator"
                />
                <p className="text-primary text-base font-medium mb-3">@alex_travels</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    4.2M Reach
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-500 dark:text-[#9db0b9] mb-2 pl-1">Bio</label>
              <textarea
                className="form-textarea w-full resize-none rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-dark focus:border-primary min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-[#58646b] p-4 text-base font-normal leading-relaxed transition-all"
                placeholder="Tell brands about your story..."
                defaultValue="Travel & Lifestyle Content Creator based in NYC. 📸 Passionate about sustainable tourism and tech gadgets. Let's create something amazing together!"
              />
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-primary/50 cursor-pointer transition-colors pl-3 pr-4">
                <Icon name="tag" className="text-primary text-[18px]" />
                <p className="text-slate-900 dark:text-white text-sm font-medium">Travel</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-primary/50 cursor-pointer transition-colors pl-3 pr-4">
                <Icon name="tag" className="text-primary text-[18px]" />
                <p className="text-slate-900 dark:text-white text-sm font-medium">Tech</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-dashed border-slate-300 dark:border-white/20 hover:border-primary hover:text-primary text-slate-500 dark:text-[#9db0b9] pl-3 pr-4 transition-all">
                <Icon name="add" className="text-[18px]" />
                <p className="text-sm font-medium">Add Tag</p>
              </div>
            </div>
          </div>

          {/* Verification Center */}
          <div className="py-2">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-dark dark:to-[#1a2e38] rounded-2xl p-5 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Icon name="verified_user" className="text-8xl text-slate-400 dark:text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                      Verification Center
                      <Icon name="verified" className="text-primary text-xl fill-1" />
                    </h3>
                    <p className="text-slate-500 dark:text-[#9db0b9] text-xs mt-1">Connect accounts to earn authenticity badges.</p>
                  </div>
                  <div className="text-primary text-xs font-bold w-10 h-10 rounded-full border-4 border-primary/30 flex items-center justify-center">
                    70%
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-[1.5px]">
                        <div className="bg-black w-full h-full rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-white">Instagram</span>
                    </div>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                      <Icon name="check_circle" size={16} /> Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">TT</span>
                      </div>
                      <span className="text-sm font-medium text-white">TikTok</span>
                    </div>
                    <button className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 my-4"></div>

          {/* Accordion: Audience Insights */}
          <div className="mb-2">
            <details className="group bg-surface-dark rounded-xl border border-white/5 overflow-hidden transition-all duration-300 open:pb-4" open>
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 transition-colors list-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon name="insights" />
                  </div>
                  <span>Audience Insights</span>
                </div>
                <Icon name="expand_more" className="transition-transform duration-300 group-open:rotate-180 text-[#9db0b9]" />
              </summary>
              <div className="px-4 pt-2 animate-fadeIn">
                {/* Auto Sync Toggle */}
                <div className="flex items-center justify-between mb-6 bg-black/20 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Auto-Sync Data</span>
                    <span className="text-xs text-[#9db0b9]">Update from connected APIs</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Gender Split */}
                <div className="mb-6 opacity-60 pointer-events-none select-none filter grayscale transition-all">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white">Gender Split</span>
                    <span className="text-xs text-[#9db0b9]">Synced via Instagram</span>
                  </div>
                  <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden flex">
                    <div className="w-[60%] bg-pink-500 h-full flex items-center justify-center text-[9px] font-bold text-white">
                      60% F
                    </div>
                    <div className="w-[40%] bg-blue-500 h-full flex items-center justify-center text-[9px] font-bold text-white">
                      40% M
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-[#9db0b9]">
                    <span>Female</span>
                    <span>Male</span>
                  </div>
                </div>

                {/* Top Locations */}
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Top Locations</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-surface-darker p-3 rounded-lg border border-white/5">
                      <div className="text-[#9db0b9]">
                        <Icon name="location_on" size={20} />
                      </div>
                      <div className="flex-1 text-sm text-white">New York, USA</div>
                      <div className="text-primary text-xs font-bold">35%</div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface-darker p-3 rounded-lg border border-white/5">
                      <div className="text-[#9db0b9]">
                        <Icon name="location_on" size={20} />
                      </div>
                      <div className="flex-1 text-sm text-white">London, UK</div>
                      <div className="text-primary text-xs font-bold">22%</div>
                    </div>
                    <button className="w-full py-2 border border-dashed border-white/20 rounded-lg text-sm text-[#9db0b9] hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2">
                      <Icon name="add" size={16} /> Add Location
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Accordion: Pricing & Packages */}
          <div className="mb-2">
            <details className="group bg-surface-dark rounded-xl border border-white/5 overflow-hidden transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 transition-colors list-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon name="currency_rupee" />
                  </div>
                  <span>Services & Rates</span>
                </div>
                <Icon name="expand_more" className="transition-transform duration-300 group-open:rotate-180 text-[#9db0b9]" />
              </summary>
              <div className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'IG Story (1 Slide)', value: '500' },
                    { label: 'IG Reel (60s)', value: '1500' },
                    { label: 'TikTok Video', value: '1200' },
                    { label: 'UGC (Usage Only)', value: '800' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs text-[#9db0b9]">{item.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">₹</span>
                        <input
                          className="w-full bg-surface-darker border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                          type="number"
                          defaultValue={item.value}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                  Manage All Packages
                </button>
              </div>
            </details>
          </div>

          {/* Accordion: Past Collaborations */}
          <div className="mb-2">
            <details className="group bg-surface-dark rounded-xl border border-white/5 overflow-hidden transition-all duration-300" open>
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 transition-colors list-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon name="collections_bookmark" />
                  </div>
                  <span>Past Collaborations</span>
                </div>
                <Icon name="expand_more" className="transition-transform duration-300 group-open:rotate-180 text-[#9db0b9]" />
              </summary>
              <div className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    {
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsq9uBwXcDPlOkvueVe8Tr9YK324Q7QVO1XrplR00GRnV99v6kktvaZIRIXqPIV3mnQXEChuZr8_3qIey3jNjAJbOqRG4FcPIqXBVIeS_TVV5bHdlQ4_MWLRfvO3XTmP1DJi6LHfzarw4JWyT8DHptpewnpt6L8S-1P40_4DJXtEBThQF0A9Fd9bmdAcTVZ2jUxM9BhKjnr_HKsm6oB1UYKu8umf3JbQ-QZ5ZJfpPYQsNroItLBC0i3t4TU0GBCAjVgMzSwu9FYw',
                      title: 'Nike Running',
                      subtitle: 'Fall Campaign',
                    },
                    {
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP4r0A4JXWVKB37p6_Ilm2fLbnKBH13SCt31SywkvtcMUAna25Gs6a0SWoquU4JkrIhEbxjezT83DIFp1BvPlCVMPcYJ5PlulR2TIS4LIDU_EXjVqqrm6IBvDbYD8onqQRQFWJhoN9WeOj3wPm8K2FTjEUTePih1S0jD56qG9An9zSytvDmaVl4COH5KsI72jFW-vnCX70K4bYWGr9RGxRYexO8pAjVXp0BgoDTG10wsY8sWcthWm-sSqdZTSyABL1JtLBYIk3wFQ',
                      title: 'Glow Recipe',
                      subtitle: 'Reels Series',
                    },
                  ].map((collab, idx) => (
                    <div key={idx} className="relative group/card cursor-pointer">
                      <div
                        className="aspect-[4/5] w-full rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url('${collab.img}')` }}
                      ></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
                        <p className="text-white text-xs font-bold">{collab.title}</p>
                        <p className="text-[10px] text-gray-300">{collab.subtitle}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <Icon name="edit" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 border border-dashed border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
                  <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon name="add" size={16} />
                  </span>
                  <span className="font-medium">Add New Campaign</span>
                </button>
              </div>
            </details>
          </div>

          <div className="h-8"></div>
        </div>

        {/* Floating Preview Button */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button className="w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
            <Icon name="visibility" size={30} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
