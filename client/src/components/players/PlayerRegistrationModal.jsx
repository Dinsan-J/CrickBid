import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Activity,
  Phone,
  Camera,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  Copy,
  Trophy,
  Calendar,
  MapPin,
  ShieldCheck,
  X
} from 'lucide-react';
import { playerApi } from '../../services/api';
import { useTournament } from '../../context/TournamentContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
].map(d => ({ value: d, label: d }));

const CRICKET_ROLES = [
  { value: 'TOP_ORDER_BATSMAN', label: 'Top Order Batsman' },
  { value: 'MIDDLE_ORDER_BATSMAN', label: 'Middle Order Batsman' },
  { value: 'WICKET_KEEPER_BATSMAN', label: 'Wicket-Keeper Batsman' },
  { value: 'BATTING_ALL_ROUNDER', label: 'Batting All-Rounder' },
  { value: 'BOWLING_ALL_ROUNDER', label: 'Bowling All-Rounder' },
  { value: 'FAST_BOWLER', label: 'Fast Bowler' },
  { value: 'SPIN_BOWLER', label: 'Spin Bowler' }
];

const BATTING_STYLES = [
  { value: 'RIGHT_HAND', label: 'Right Hand Bat' },
  { value: 'LEFT_HAND', label: 'Left Hand Bat' }
];

const BOWLING_STYLES = [
  { value: 'Right-Arm Fast (140kph+)', label: 'Right-Arm Fast (140kph+)' },
  { value: 'Right-Arm Medium Fast', label: 'Right-Arm Medium Fast' },
  { value: 'Right-Arm Off Spin', label: 'Right-Arm Off Spin' },
  { value: 'Right-Arm Leg Spin / Googly', label: 'Right-Arm Leg Spin / Googly' },
  { value: 'Left-Arm Fast / Swing', label: 'Left-Arm Fast / Swing' },
  { value: 'Slow Left-Arm Orthodox', label: 'Slow Left-Arm Orthodox' },
  { value: 'Left-Arm Chinaman / Wrist Spin', label: 'Left-Arm Chinaman / Wrist Spin' },
  { value: 'Wicket-Keeper / Non-Bowler', label: 'Wicket-Keeper / Non-Bowler' }
];

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Cricket Stats', icon: Activity },
  { id: 3, title: 'Contact & Location', icon: Phone },
  { id: 4, title: 'Photo & Review', icon: Camera }
];

export default function PlayerRegistrationModal({ isOpen, onClose, onPlayerRegistered }) {
  const { tournament } = useTournament();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredPlayer, setRegisteredPlayer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    playingRole: 'TOP_ORDER_BATSMAN',
    battingStyle: 'RIGHT_HAND',
    bowlingStyle: 'Right-Arm Medium Fast',
    experience: '',
    additionalInfo: '',
    phone: '',
    whatsapp: '',
    district: 'Colombo',
    town: '',
    whatsappConsent: true,
    photoUrl: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const copyPhoneToWhatsApp = () => {
    handleChange('whatsapp', formData.phone);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPreviewImage(uploadEvent.target.result);
      handleChange('photoUrl', uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage('Full name is required.');
        return false;
      }
      if (!formData.dob) {
        setErrorMessage('Date of birth is required.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.playingRole) {
        setErrorMessage('Please select a playing role.');
        return false;
      }
      if (!formData.battingStyle) {
        setErrorMessage('Please select a batting style.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.phone.trim()) {
        setErrorMessage('Primary phone number is required.');
        return false;
      }
      if (!formData.whatsapp.trim()) {
        setErrorMessage('WhatsApp contact number is required.');
        return false;
      }
      if (!formData.town.trim()) {
        setErrorMessage('Town / city is required.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        tournamentId: tournament?._id,
        ...formData,
        photoUrl: previewImage || formData.photoUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80'
      };

      const res = await playerApi.registerJson(payload);

      if (res.success && res.data) {
        setRegisteredPlayer(res.data);
        if (onPlayerRegistered) {
          onPlayerRegistered(res.data);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check form inputs.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRegisteredPlayer(null);
    setPreviewImage(null);
    setFormData({
      fullName: '',
      dob: '',
      gender: 'Male',
      playingRole: 'TOP_ORDER_BATSMAN',
      battingStyle: 'RIGHT_HAND',
      bowlingStyle: 'Right-Arm Medium Fast',
      experience: '',
      additionalInfo: '',
      phone: '',
      whatsapp: '',
      district: 'Colombo',
      town: '',
      whatsappConsent: true,
      photoUrl: ''
    });
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Player Registration Portal
              </h2>
              <p className="text-xs text-slate-400">
                {tournament?.name || 'Tournament'} • Official Verification Registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!registeredPlayer && (
          <div className="px-6 pt-5 pb-3 border-b border-slate-800/60 bg-slate-950/40">
            <div className="flex items-center justify-between relative">
              {STEPS.map((s, idx) => {
                const IconComponent = s.icon;
                const isActive = step === s.id;
                const isPassed = step > s.id;

                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        if (s.id < step) setStep(s.id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400/50'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                    </button>
                    <span className={`text-[10px] font-bold mt-1.5 transition-colors hidden sm:block ${
                      isActive ? 'text-emerald-400' : isPassed ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}

              {/* Connecting line */}
              <div className="absolute top-4.5 left-8 right-8 h-0.5 bg-slate-800 -z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Body or Success State */}
        <div className="p-6">
          {registeredPlayer ? (
            /* Submission Success Animation Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <Badge variant="lime" size="md" className="uppercase font-mono mb-2">
                  Registration Successful
                </Badge>
                <h3 className="text-2xl font-black text-white">
                  Welcome to the Draft, {registeredPlayer.fullName}!
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Your profile has been committed to MongoDB and submitted to the tournament organiser for verification.
                </p>
              </div>

              {/* Registration Card Summary */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Official Player ID</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {registeredPlayer.registrationNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Playing Role</span>
                  <span className="text-xs font-semibold text-white">
                    {registeredPlayer.playingRole.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Review Status</span>
                  <Badge variant="amber" size="sm">
                    {registeredPlayer.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">WhatsApp Alerts</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Opted In ({registeredPlayer.whatsapp})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <Button variant="outline" onClick={resetForm}>
                  Register Another Player
                </Button>
                <Button variant="primary" onClick={onClose}>
                  Done & Return to Registry
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message Notice */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* STEP 1: PERSONAL INFORMATION */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label="Full Legal Name"
                          required
                          placeholder="e.g. Pathum Nissanka Silva"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          helper="As appears on National Identity Card (NIC) or Passport"
                        />
                      </div>

                      <Input
                        label="Date of Birth"
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => handleChange('dob', e.target.value)}
                      />

                      <Select
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        options={[
                          { value: 'Male', label: 'Male' },
                          { value: 'Female', label: 'Female' },
                          { value: 'Other', label: 'Other' }
                        ]}
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CRICKET INFORMATION */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Select
                          label="Primary Cricket Role"
                          required
                          value={formData.playingRole}
                          onChange={(e) => handleChange('playingRole', e.target.value)}
                          options={CRICKET_ROLES}
                        />
                      </div>

                      <Select
                        label="Batting Style"
                        required
                        value={formData.battingStyle}
                        onChange={(e) => handleChange('battingStyle', e.target.value)}
                        options={BATTING_STYLES}
                      />

                      <Select
                        label="Bowling Style"
                        value={formData.bowlingStyle}
                        onChange={(e) => handleChange('bowlingStyle', e.target.value)}
                        options={BOWLING_STYLES}
                      />

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Previous Cricket Experience
                        </label>
                        <textarea
                          rows={2}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Major Club Division 1 (SSC), School 1st XI (Richmond College), Provincial Tournament..."
                          value={formData.experience}
                          onChange={(e) => handleChange('experience', e.target.value)}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Notable Achievements / Additional Notes (Optional)
                        </label>
                        <textarea
                          rows={2}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Highest score 142* in Sara Trophy 2025; 5/18 against CCC."
                          value={formData.additionalInfo}
                          onChange={(e) => handleChange('additionalInfo', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CONTACT & LOCATION */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Primary Phone Number (+94)"
                        required
                        placeholder="+94 77 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        helper="Used for identity verification & auction bid alerts"
                      />

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300">
                            WhatsApp Number <span className="text-emerald-400">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={copyPhoneToWhatsApp}
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Copy className="w-3 h-3" /> Same as Phone
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="+94 77 123 4567"
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={formData.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                        />
                      </div>

                      <Select
                        label="District (Sri Lanka)"
                        required
                        value={formData.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        options={SRI_LANKAN_DISTRICTS}
                      />

                      <Input
                        label="Town / City"
                        required
                        placeholder="e.g. Nugegoda, Moratuwa, Negombo"
                        value={formData.town}
                        onChange={(e) => handleChange('town', e.target.value)}
                      />
                    </div>

                    {/* WhatsApp Consent Box */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="whatsapp-optin"
                        checked={formData.whatsappConsent}
                        onChange={(e) => handleChange('whatsappConsent', e.target.checked)}
                        className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 w-4 h-4 accent-emerald-500"
                      />
                      <label htmlFor="whatsapp-optin" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                        <strong className="text-emerald-400 font-bold block">WhatsApp Real-Time Auction Consent:</strong>
                        I explicitly consent to receive official WhatsApp notifications regarding auction scheduling, gavel bidding results, and squad contract status from the central CricketBid notification engine.
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: PHOTOGRAPH & FINAL REVIEW */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Drag-and-Drop Image Uploader */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Official Player Photograph
                      </label>

                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleFileDrop}
                        className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                          dragActive
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                        }`}
                      >
                        {previewImage ? (
                          <div className="flex flex-col items-center gap-3">
                            <img
                              src={previewImage}
                              alt="Player preview"
                              className="w-24 h-24 object-cover rounded-2xl border-2 border-emerald-500 shadow-xl"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-emerald-400 font-semibold">Photo Attached</span>
                              <button
                                type="button"
                                onClick={() => { setPreviewImage(null); handleChange('photoUrl', ''); }}
                                className="text-xs text-red-400 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                            <div className="text-xs font-bold text-white">
                              Drag and drop portrait photo here, or browse
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Supports JPG, PNG, WebP (High resolution recommended for broadcast graphics)
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              id="player-photo-input"
                              className="hidden"
                              onChange={handleFileInput}
                            />
                            <label htmlFor="player-photo-input">
                              <Button variant="outline" size="sm" as="span" className="cursor-pointer">
                                Choose Image File
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Review Card */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1.5 flex items-center justify-between">
                        <span>Review Submission Summary</span>
                        <Badge variant="lime" size="sm">Ready to Register</Badge>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Name:</span>
                          <strong className="text-white">{formData.fullName || '—'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Role:</span>
                          <strong className="text-emerald-400">{formData.playingRole.replace(/_/g, ' ')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Phone & WhatsApp:</span>
                          <span>{formData.phone || '—'} / {formData.whatsapp || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">District & Town:</span>
                          <span>{formData.town}, {formData.district}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Batting & Bowling:</span>
                          <span>{formData.battingStyle.replace(/_/g, ' ')} • {formData.bowlingStyle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Tournament:</span>
                          <span className="font-semibold text-white">{tournament?.name}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    icon={ChevronLeft}
                    onClick={prevStep}
                    disabled={loading}
                  >
                    Back
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    Submit Player to MongoDB Draft
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
