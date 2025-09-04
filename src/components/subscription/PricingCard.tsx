import React from 'react';
import { Check, Star } from 'lucide-react';
import type { PricingCardProps } from '../../types/subscription';
import { subscriptionAPI } from '../../services/subscriptionAPI';

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  billingCycle, 
  isPopular = false, 
  onSelectPlan 
}) => {
  const price = subscriptionAPI.getPricing(plan, billingCycle);
  const savings = subscriptionAPI.getSavingsPercentage(plan, billingCycle);
  const billingText = subscriptionAPI.getBillingCycleText(billingCycle);
  const colorTheme = subscriptionAPI.getPlanColor(plan.code);

  const getColorClasses = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          accent: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'purple':
        return {
          border: 'border-purple-200 ring-2 ring-purple-500',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          accent: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800'
        };
      case 'gold':
        return {
          border: 'border-yellow-200',
          button: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
          accent: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg ${colors.border} p-8 ${isPopular ? 'transform scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className={`${colors.badge} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1`}>
            <Star className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {subscriptionAPI.formatPrice(price)}
            </span>
            <span className="text-gray-600 text-lg">/{billingText.split(' ')[1]}</span>
          </div>
          
          {savings > 0 && (
            <div className={`${colors.badge} inline-block px-3 py-1 rounded-full text-sm font-medium mt-2`}>
              Save {savings}%
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {plan.applicationLimit === -1 
            ? 'Unlimited IT job applications' 
            : `${plan.applicationLimit} IT job applications ${billingText}`
          }
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelectPlan(plan.code, billingCycle)}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${colors.button}`}
      >
        {plan.code === 'BASIC' ? 'Start Basic Plan' : 
         plan.code === 'PROFESSIONAL' ? 'Go Professional' : 
         'Contact Sales'}
      </button>

      {plan.code === 'ENTERPRISE' && (
        <p className="text-center text-sm text-gray-500 mt-3">
          Custom pricing available for large teams
        </p>
      )}
    </div>
  );
};

export default PricingCard;
