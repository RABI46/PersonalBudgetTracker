
// React and core dependencies
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryFunction } from '@tanstack/react-query';

// UI Components from shadcn
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';
import { Toast } from '@/components/ui/toast';

// Custom components
import { CravingModal } from '@/components/craving-modal';
import { Layout } from '@/components/layout/layout';
import { UserProfileForm } from '@/components/profile/user-profile-form';
import { CigaretteTracker } from '@/components/dashboard/cigarette-tracker';
import { HealthBenefits } from '@/components/dashboard/health-benefits';
import { SavingsCalculator } from '@/components/dashboard/savings-calculator';
import { StatsOverview } from '@/components/dashboard/stats-overview';

// Hooks and utilities
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { calculateBenefits } from '@/lib/calculate-benefits';
import { getDefaultUserData } from '@/lib/get-default-user-data';
import { APP_NAME, CRAVING_CONTEXTS, CRAVING_INTENSITIES } from '@/lib/constants';

// Pages
import { Dashboard } from '@/pages/dashboard';
import { Home } from '@/pages/home';
import { Profile } from '@/pages/profile';
import { Statistics } from '@/pages/statistics';
import { Tips } from '@/pages/tips';
import { NotFound } from '@/pages/not-found';

// Server dependencies
import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Types and schemas
import { z } from 'zod';
import { type User, type Craving, type Achievement } from '@shared/schema';
