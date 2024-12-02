import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import InfoTooltip from '../InfoTooltip';
import { tooltips } from './tooltips';
import './styles.css';

const AdvancedMarketingCalculator = () => {
  const [inputs, setInputs] = useState({
    cpm: '',
    budget: '',
    ctr: '',
    leadConversionRate: '',
    saleConversionRate: '',
    revenuePerDeal: '',
    profitMargin: '',
    marketerFee: ''
  });
  
  const [showRoi, setShowRoi] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const calculateMetrics = () => {
    const vals = {
      cpm: parseFloat(inputs.cpm) || 0,
      budget: parseFloat(inputs.budget) || 0,
      ctr: parseFloat(inputs.ctr) || 0,
      leadConversionRate: parseFloat(inputs.leadConversionRate) || 0,
      saleConversionRate: parseFloat(inputs.saleConversionRate) || 0,
      revenuePerDeal: parseFloat(inputs.revenuePerDeal) || 0,
      profitMargin: parseFloat(inputs.profitMargin) || 0,
      marketerFee: parseFloat(inputs.marketerFee) || 0
    };

    // Marketing metrics
    const impressions = (vals.budget / vals.cpm) * 1000;
    const clicks = impressions * (vals.ctr / 100);
    const leads = clicks * (vals.leadConversionRate / 100);
    const sales = leads * (vals.saleConversionRate / 100);
    const cpl = leads > 0 ? vals.budget / leads : 0;
    const cpa = sales > 0 ? vals.budget / sales : 0;

    // ROI metrics
    const totalCost = vals.budget + vals.marketerFee;
    const totalRevenue = sales * vals.revenuePerDeal;
    const netRevenue = totalRevenue * (vals.profitMargin / 100);
    const roi = totalCost > 0 ? ((netRevenue - totalCost) / totalCost) * 100 : 0;

    return {
      impressions,
      clicks,
      leads,
      sales,
      cpl,
      cpa,
      totalCost,
      totalRevenue,
      netRevenue,
      roi
    };
  };

  const formatNumber = (num, withShekels = false) => {
    if (!num || isNaN(num)) return "-";
    const formattedNum = new Intl.NumberFormat('he-IL', {
      maximumFractionDigits: 0
    }).format(num);
    return withShekels ? `₪${formattedNum}` : formattedNum;
  };

  const metrics = calculateMetrics();

  const InputWithTooltip = ({ id, label, value, placeholder, tooltip }) => (
    <div className="input-group">
      <div className="label-with-tooltip">
        <Label htmlFor={id}>{label}</Label>
        <InfoTooltip content={tooltip} />
      </div>
      <input
        id={id}
        type="number"
        className="w-full p-2 mt-1 border rounded-lg text-right"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">מחשבון שיווק ו-ROI</CardTitle>
        <div className="flex items-center justify-center space-x-4 space-x-reverse mt-4">
          <Label htmlFor="roi-mode">מצב ROI מורחב</Label>
          <Switch
            id="roi-mode"
            checked={showRoi}
            onCheckedChange={setShowRoi}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">נתוני קמפיין</h3>
            
            {/* Marketing Inputs */}
            <div className="space-y-4">
              <InputWithTooltip
                id="cpm"
                label="CPM - עלות לאלף חשיפות (₪)"
                value={inputs.cpm}
                placeholder="הזן CPM"
                tooltip={tooltips.cpm}
              />
              <InputWithTooltip
                id="budget"
                label="תקציב חודשי (₪)"
                value={inputs.budget}
                placeholder="הזן תקציב"
                tooltip={tooltips.budget}
              />
              <InputWithTooltip
                id="ctr"
                label="אחוז קליקים - CTR (%)"
                value={inputs.ctr}
                placeholder="הזן CTR"
                tooltip={tooltips.ctr}
              />
              <InputWithTooltip
                id="leadConversionRate"
                label="אחוז המרה מקליק לליד (%)"
                value={inputs.leadConversionRate}
                placeholder="הזן אחוז המרה לליד"
                tooltip={tooltips.leadConversionRate}
              />
            </div>

            {/* ROI Inputs */}
            {showRoi && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">נתוני ROI</h3>
                <InputWithTooltip
                  id="saleConversionRate"
                  label="אחוז המרה מליד למכירה (%)"
                  value={inputs.saleConversionRate}
                  placeholder="הזן אחוז המרה למכירה"
                  tooltip={tooltips.saleConversionRate}
                />
                <InputWithTooltip
                  id="revenuePerDeal"
                  label="הכנסה לעסקה (₪)"
                  value={inputs.revenuePerDeal}
                  placeholder="הזן הכנסה לעסקה"
                  tooltip={tooltips.revenuePerDeal}
                />
                <InputWithTooltip
                  id="profitMargin"
                  label="שולי רווח (%)"
                  value={inputs.profitMargin}
                  placeholder="הזן שולי רווח"
                  tooltip={tooltips.profitMargin}
                />
                <InputWithTooltip
                  id="marketerFee"
                  label="עלות משווק (₪)"
                  value={inputs.marketerFee}
                  placeholder="הזן עלות משווק"
                  tooltip={tooltips.marketerFee}
                />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">תוצאות</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Marketing Results */}
              <div className="col-span-2">
                <div className="text-sm text-gray-600 mb-1">סך חשיפות</div>
                <div className="text-xl font-semibold">{formatNumber(metrics.impressions)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">סך קליקים</div>
                <div className="text-xl font-semibold">{formatNumber(metrics.clicks)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">סך לידים</div>
                <div className="text-xl font-semibold">{formatNumber(metrics.leads)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">עלות פר ליד</div>
                <div className="text-xl font-semibold">{formatNumber(metrics.cpl, true)}</div>
              </div>

              {/* ROI Results */}
              {showRoi && (
                <>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">סך מכירות</div>
                    <div className="text-xl font-semibold">{formatNumber(metrics.sales)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">עלות למכירה</div>
                    <div className="text-xl font-semibold">{formatNumber(metrics.cpa, true)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">סך עלויות</div>
                    <div className="text-xl font-semibold">{formatNumber(metrics.totalCost, true)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">סך הכנסות</div>
                    <div className="text-xl font-semibold">{formatNumber(metrics.totalRevenue, true)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">הכנסה נטו</div>
                    <div className="text-xl font-semibold">{formatNumber(metrics.netRevenue, true)}</div>
                  </div>
                  <div className="col-span-2 border-t pt-4 mt-2">
                    <div className="text-sm text-gray-600 mb-1">החזר השקעה</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.roi ? `${metrics.roi.toFixed(1)}%` : "-"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedMarketingCalculator;
