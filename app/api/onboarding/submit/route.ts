import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../services/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';

// Type definitions for our database schemas
interface HospitalRecord {
  name: string;
  address: string;
  size: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  createdAt: Timestamp;
  status: 'active' | 'pending' | 'suspended';
  careOrchestratorEnabled: boolean;
}

interface AdminUserRecord {
  email: string;
  name: string;
  phone: string;
  hospitalId: string;
  role: 'admin' | 'super_admin';
  createdAt: Timestamp;
  lastLogin: Timestamp | null;
  status: 'active' | 'pending' | 'suspended';
  permissions: string[];
}

interface SubscriptionRecord {
  hospitalId: string;
  planTier: 'basic' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'pending' | 'cancelled';
  startDate: Timestamp;
  endDate: Timestamp;
  price: number;
  createdAt: Timestamp;
  features: string[];
}

interface DoctorInvitationRecord {
  hospitalId: string;
  email: string;
  status: 'pending' | 'sent' | 'accepted' | 'declined';
  invitedAt: Timestamp;
  invitedBy: string;
  expiresAt: Timestamp;
  invitationToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { hospitalInfo, planSelection, doctorInvites, confirmation } = body;
    
    if (!hospitalInfo || !planSelection || !doctorInvites || !confirmation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required data',
          message: 'Please complete all onboarding steps'
        },
        { status: 400 }
      );
    }

    // Validate hospital info
    if (!hospitalInfo.hospitalName || !hospitalInfo.adminEmail || !hospitalInfo.adminName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid hospital information',
          message: 'Please provide complete hospital details'
        },
        { status: 400 }
      );
    }

    // Validate plan selection
    if (!planSelection.planTier || !planSelection.planType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid plan selection',
          message: 'Please select a valid subscription plan'
        },
        { status: 400 }
      );
    }

    // Validate terms agreement
    if (!confirmation.agreedToTerms) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terms not agreed',
          message: 'You must agree to the terms of service to continue'
        },
        { status: 400 }
      );
    }

    console.log('Processing Care Orchestrator onboarding:', {
      hospital: hospitalInfo.hospitalName,
      admin: hospitalInfo.adminEmail,
      plan: planSelection.planTier,
      doctors: doctorInvites.emails.length
    });

    // Generate unique IDs
    const hospitalId = `hosp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const adminUserId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate subscription pricing
    const planPricing = {
      basic: { monthly: 299, yearly: 2999 },
      professional: { monthly: 599, yearly: 5999 },
      enterprise: { monthly: 999, yearly: 9999 }
    };

    const price = planPricing[planSelection.planTier][planSelection.planType];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (planSelection.planType === 'yearly' ? 12 : 1));

    // Check if Firebase is properly configured
    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'decentramind-demo';

    if (isFirebaseConfigured) {
      // Production mode: Use Firebase Firestore
      try {
        // Create a batch for atomic operations
        const batch = writeBatch(db);
        
        // 1. Create Hospital Record
        const hospitalData: HospitalRecord = {
          name: hospitalInfo.hospitalName,
          address: hospitalInfo.hospitalAddress,
          size: hospitalInfo.hospitalSize,
          contactEmail: hospitalInfo.adminEmail,
          contactPhone: hospitalInfo.adminPhone,
          adminName: hospitalInfo.adminName,
          createdAt: serverTimestamp() as Timestamp,
          status: 'active',
          careOrchestratorEnabled: true
        };

        const hospitalRef = doc(db, 'hospitals', hospitalId);
        batch.set(hospitalRef, hospitalData);

        // 2. Create Admin User Record
        const adminData: AdminUserRecord = {
          email: hospitalInfo.adminEmail,
          name: hospitalInfo.adminName,
          phone: hospitalInfo.adminPhone,
          hospitalId: hospitalId,
          role: 'admin',
          createdAt: serverTimestamp() as Timestamp,
          lastLogin: null,
          status: 'active',
          permissions: [
            'manage_hospital',
            'invite_doctors',
            'manage_subscription',
            'access_care_orchestrator',
            'view_analytics'
          ]
        };

        const adminRef = doc(db, 'admin_users', adminUserId);
        batch.set(adminRef, adminData);

        // 3. Create Subscription Record
        const subscriptionData: SubscriptionRecord = {
          hospitalId: hospitalId,
          planTier: planSelection.planTier,
          billingCycle: planSelection.planType,
          status: 'active',
          startDate: serverTimestamp() as Timestamp,
          endDate: Timestamp.fromDate(endDate),
          price: price,
          createdAt: serverTimestamp() as Timestamp,
          features: getPlanFeatures(planSelection.planTier)
        };

        const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
        batch.set(subscriptionRef, subscriptionData);

        // 4. Create Doctor Invitation Records
        const invitationPromises = doctorInvites.emails.map(async (email: string) => {
          const invitationId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const invitationToken = generateInvitationToken();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

          const invitationData: DoctorInvitationRecord = {
            hospitalId: hospitalId,
            email: email.toLowerCase().trim(),
            status: 'pending',
            invitedAt: serverTimestamp() as Timestamp,
            invitedBy: hospitalInfo.adminEmail,
            expiresAt: Timestamp.fromDate(expiresAt),
            invitationToken: invitationToken
          };

          const invitationRef = doc(db, 'doctor_invitations', invitationId);
          batch.set(invitationRef, invitationData);

          return invitationId;
        });

        // Wait for all invitation records to be prepared
        await Promise.all(invitationPromises);

        // 5. Create Care Orchestrator Agent Record
        const agentData = {
          id: 'care-orchestrator',
          hospitalId: hospitalId,
          name: 'Care Orchestrator',
          type: 'healthcare',
          status: 'active',
          createdAt: serverTimestamp(),
          configuration: {
            enabledFeatures: getPlanFeatures(planSelection.planTier),
            hospitalSize: hospitalInfo.hospitalSize,
            customizations: {}
          },
          metrics: {
            doctorsInvited: doctorInvites.emails.length,
            tasksCompleted: 0,
            lastActive: null
          }
        };

        const agentRef = doc(db, 'care_orchestrator_agents', `${hospitalId}_care_orchestrator`);
        batch.set(agentRef, agentData);

        // Execute the batch operation
        await batch.commit();

        console.log('Successfully created hospital onboarding in Firebase:', {
          hospitalId,
          subscriptionId,
          adminUserId,
          invitations: doctorInvites.emails.length
        });

      } catch (firebaseError) {
        console.error('Firebase operation failed:', firebaseError);
        throw new Error(`Firebase operation failed: ${firebaseError.message}`);
      }
    } else {
      // Development mode: Simulate database operations
      console.log('Development mode: Simulating database operations');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Simulated database records created:', {
        hospitals: {
          [hospitalId]: {
            name: hospitalInfo.hospitalName,
            address: hospitalInfo.hospitalAddress,
            size: hospitalInfo.hospitalSize,
            contactEmail: hospitalInfo.adminEmail,
            contactPhone: hospitalInfo.adminPhone,
            adminName: hospitalInfo.adminName,
            status: 'active',
            careOrchestratorEnabled: true
          }
        },
        admin_users: {
          [adminUserId]: {
            email: hospitalInfo.adminEmail,
            name: hospitalInfo.adminName,
            phone: hospitalInfo.adminPhone,
            hospitalId: hospitalId,
            role: 'admin',
            status: 'active',
            permissions: [
              'manage_hospital',
              'invite_doctors',
              'manage_subscription',
              'access_care_orchestrator',
              'view_analytics'
            ]
          }
        },
        subscriptions: {
          [subscriptionId]: {
            hospitalId: hospitalId,
            planTier: planSelection.planTier,
            billingCycle: planSelection.planType,
            status: 'active',
            price: price,
            features: getPlanFeatures(planSelection.planTier)
          }
        },
        doctor_invitations: doctorInvites.emails.map(email => ({
          hospitalId: hospitalId,
          email: email.toLowerCase().trim(),
          status: 'pending',
          invitedBy: hospitalInfo.adminEmail,
          invitationToken: generateInvitationToken()
        })),
        care_orchestrator_agents: {
          [`${hospitalId}_care_orchestrator`]: {
            id: 'care-orchestrator',
            hospitalId: hospitalId,
            name: 'Care Orchestrator',
            type: 'healthcare',
            status: 'active',
            configuration: {
              enabledFeatures: getPlanFeatures(planSelection.planTier),
              hospitalSize: hospitalInfo.hospitalSize,
              customizations: {}
            },
            metrics: {
              doctorsInvited: doctorInvites.emails.length,
              tasksCompleted: 0,
              lastActive: null
            }
          }
        }
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Care Orchestrator setup completed successfully',
      data: {
        hospitalId,
        subscriptionId,
        adminUserId,
        agentId: 'care-orchestrator',
        dashboardUrl: '/dashboard',
        invitationsSent: doctorInvites.emails.length,
        mode: isFirebaseConfigured ? 'production' : 'development'
      },
      nextSteps: [
        'Access your Care Orchestrator dashboard',
        'Invited doctors will receive email invitations',
        'Set up your first healthcare workflows',
        'Configure AI agent preferences'
      ]
    });
    
  } catch (error) {
    console.error('Onboarding submission error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process onboarding data',
        message: 'Please try again or contact support',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to get plan features
function getPlanFeatures(planTier: string): string[] {
  const features = {
    basic: [
      'up_to_50_doctors',
      'basic_ai_insights',
      'email_support',
      'standard_integrations',
      'basic_analytics'
    ],
    professional: [
      'up_to_200_doctors',
      'advanced_ai_insights',
      'priority_support',
      'advanced_integrations',
      'advanced_analytics',
      'custom_workflows',
      'api_access'
    ],
    enterprise: [
      'unlimited_doctors',
      'premium_ai_insights',
      'dedicated_support',
      'all_integrations',
      'enterprise_analytics',
      'custom_workflows',
      'full_api_access',
      'white_label_options',
      'sla_guarantee'
    ]
  };
  
  return features[planTier] || features.basic;
}

// Helper function to generate invitation token
function generateInvitationToken(): string {
  return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}
