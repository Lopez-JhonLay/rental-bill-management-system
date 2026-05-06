import { useState, useRef } from 'react';
import { Download, X, Loader2, Eye, ArrowLeft } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import type { Bill } from '../../types';

type DownloadBillModalProps = {
  bill: Bill;
  onClose: () => void;
};

export default function DownloadBillModal({ bill, onClose }: DownloadBillModalProps) {
  const [selectedItems, setSelectedItems] = useState({
    electricity: true,
    water: true,
    rent: true,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const billPreviewRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (item: keyof typeof selectedItems) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleDownload = async () => {
    if (!billPreviewRef.current) return;

    setIsGenerating(true);

    try {
      const scrollContainer = document.getElementById('bill-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollLeft = 0;
        scrollContainer.scrollTop = 0;
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      // Get the actual width of the bill preview element
      const actualWidth = billPreviewRef.current.offsetWidth;

      const dataUrl = await htmlToImage.toPng(billPreviewRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width: actualWidth, // Use actual width instead of fixed 800
        style: {
          margin: '0', // Reset margin on the cloned element to prevent offsets
        },
      });

      // Safely format the filename
      const safeMonth = bill.billing_month ? bill.billing_month.replace(/\s+/g, '-') : 'unknown-month';
      const safeTenant = bill.tenant?.tenant_name ? bill.tenant.tenant_name.replace(/\s+/g, '-') : 'unknown-tenant';

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `bill-${safeMonth}-${safeTenant}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating bill image:', error);
      setIsGenerating(false);
    }
  };

  const isAnySelected = Object.values(selectedItems).some((value) => value);
  const kwhConsumed = bill.current_kwh - bill.previous_kwh;

  // Extract first name from tenant name.
  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return 'N/A';
    return fullName.split(' ')[0];
  };

  return (
    <dialog className="modal modal-open">
      <div
        className={`modal-box transition-all duration-300 w-11/12 max-w-full ${showPreview ? 'sm:max-w-3xl' : 'sm:max-w-2xl'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base sm:text-lg">{showPreview ? 'Bill Preview' : 'Download Bill'}</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} disabled={isGenerating}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showPreview ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-base-content/60 mb-2">
                Bill for: <span className="font-medium text-base-content">{bill.billing_month}</span>
              </p>
              <p className="text-sm text-base-content/60">
                Total:{' '}
                <span className="font-medium text-base-content">₱{Number(bill.total_amount).toLocaleString()}</span>
              </p>
            </div>

            <div className="divider my-4">Select items to include</div>

            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedItems.electricity}
                  onChange={() => handleCheckboxChange('electricity')}
                />
                <div className="flex-1">
                  <div className="font-medium">Electricity</div>
                  <div className="text-sm text-base-content/60">
                    ₱{Number(bill.electricity_charge).toLocaleString()}
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedItems.water}
                  onChange={() => handleCheckboxChange('water')}
                />
                <div className="flex-1">
                  <div className="font-medium">Water</div>
                  <div className="text-sm text-base-content/60">₱{Number(bill.water_charge).toLocaleString()}</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedItems.rent}
                  onChange={() => handleCheckboxChange('rent')}
                />
                <div className="flex-1">
                  <div className="font-medium">Rent</div>
                  <div className="text-sm text-base-content/60">₱{Number(bill.rent_charge).toLocaleString()}</div>
                </div>
              </label>
            </div>

            {!isAnySelected && (
              <div className="alert alert-warning mb-4">
                <span className="text-sm">Please select at least one item to download</span>
              </div>
            )}

            <div className="modal-action flex-col sm:flex-row gap-2">
              <button className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary gap-2 w-full sm:w-auto order-1 sm:order-2"
                onClick={() => setShowPreview(true)}
                disabled={!isAnySelected}
              >
                <Eye className="w-4 h-4" />
                Preview Bill
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              id="bill-scroll-container"
              className="bg-base-200 rounded-xl overflow-auto max-h-[60vh] mb-4 border border-base-300"
            >
              <div style={{ minWidth: '320px', padding: '8px' }} className="sm:p-4">
                <div
                  ref={billPreviewRef}
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    background: 'white',
                    padding: '20px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#000000',
                    boxSizing: 'border-box',
                  }}
                  className="sm:p-10"
                >
                  <div
                    style={{ border: '4px solid #000000', padding: '32px' }}
                    className="border-2! p-4! sm:border-4! sm:p-8!"
                  >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }} className="mb-4! sm:mb-8!">
                      <h1
                        style={{ fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px 0' }}
                        className="text-xl! sm:text-3xl!"
                      >
                        BILLING STATEMENT
                      </h1>
                      <p style={{ fontSize: '20px', margin: 0 }} className="text-base! sm:text-xl!">
                        {bill.billing_month}
                      </p>
                    </div>

                    {/* Tenant Info */}
                    <div
                      style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #808080' }}
                      className="mb-4! pb-3! sm:mb-6! sm:pb-4!"
                    >
                      <p style={{ fontSize: '18px', margin: '0 0 8px 0' }} className="text-sm! sm:text-lg!">
                        <strong>Name:</strong> {getFirstName(bill.tenant?.tenant_name)}
                      </p>
                    </div>

                    {/* Bill Details */}
                    <div>
                      {/* Electricity */}
                      {selectedItems.electricity && (
                        <div
                          style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}
                          className="p-3! mb-4! sm:p-4! sm:mb-6!"
                        >
                          <h3
                            style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}
                            className="text-base! mb-2! sm:text-xl! sm:mb-3!"
                          >
                            ELECTRICITY
                          </h3>
                          <div style={{ fontSize: '16px' }} className="text-sm! sm:text-base!">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Previous Reading:</span>
                              <span style={{ fontWeight: '500' }}>{bill.previous_kwh} kWh</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Current Reading:</span>
                              <span style={{ fontWeight: '500' }}>{bill.current_kwh} kWh</span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '1px solid #808080',
                                paddingTop: '8px',
                                marginBottom: '8px',
                              }}
                            >
                              <span>Consumption:</span>
                              <span style={{ fontWeight: '500' }}>{kwhConsumed} kWh</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Rate per kWh:</span>
                              <span style={{ fontWeight: '500' }}>₱{Number(bill.electricity_rate).toFixed(2)}</span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '2px solid gray',
                                paddingTop: '8px',
                                marginTop: '8px',
                              }}
                            >
                              <span style={{ fontWeight: 'bold' }}>Total:</span>
                              <span style={{ fontWeight: 'bold', fontSize: '18px' }} className="text-base! sm:text-lg!">
                                ₱{Number(bill.electricity_charge).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Water */}
                      {selectedItems.water && (
                        <div
                          style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}
                          className="p-3! mb-4! sm:p-4! sm:mb-6!"
                        >
                          <h3
                            style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}
                            className="text-base! mb-2! sm:text-xl! sm:mb-3!"
                          >
                            WATER
                          </h3>
                          <div style={{ fontSize: '16px' }} className="text-sm! sm:text-base!">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Number of Persons:</span>
                              <span style={{ fontWeight: '500' }}>{bill.tenant?.person_count || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Rate per Person:</span>
                              <span style={{ fontWeight: '500' }}>₱{Number(bill.water_rate).toFixed(2)}</span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '2px solid #808080',
                                paddingTop: '8px',
                                marginTop: '8px',
                              }}
                            >
                              <span style={{ fontWeight: 'bold' }}>Total:</span>
                              <span style={{ fontWeight: 'bold', fontSize: '18px' }} className="text-base! sm:text-lg!">
                                ₱{Number(bill.water_charge).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rent */}
                      {selectedItems.rent && (
                        <div
                          style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}
                          className="p-3! mb-4! sm:p-4! sm:mb-6!"
                        >
                          <h3
                            style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}
                            className="text-base! mb-2! sm:text-xl! sm:mb-3!"
                          >
                            MONTHLY RENT
                          </h3>
                          <div style={{ fontSize: '16px' }} className="text-sm! sm:text-base!">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span>Monthly Rate:</span>
                              <span style={{ fontWeight: '500' }}>₱{Number(bill.rent_charge).toLocaleString()}</span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '2px solid #808080',
                                paddingTop: '8px',
                                marginTop: '8px',
                              }}
                            >
                              <span style={{ fontWeight: 'bold' }}>Total:</span>
                              <span style={{ fontWeight: 'bold', fontSize: '18px' }} className="text-base! sm:text-lg!">
                                ₱{Number(bill.rent_charge).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div
                        style={{
                          background: '#000000',
                          color: '#ffffff',
                          padding: '16px',
                          borderRadius: '8px',
                          marginTop: '24px',
                        }}
                        className="p-3! mt-4! sm:p-4! sm:mt-6!"
                      >
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          className="flex-col gap-2 sm:flex-row sm:gap-0"
                        >
                          <span style={{ fontSize: '20px', fontWeight: 'bold' }} className="text-base! sm:text-xl!">
                            TOTAL AMOUNT DUE:
                          </span>
                          <span style={{ fontSize: '24px', fontWeight: 'bold' }} className="text-xl! sm:text-2xl!">
                            ₱
                            {(
                              (selectedItems.electricity ? Number(bill.electricity_charge) : 0) +
                              (selectedItems.water ? Number(bill.water_charge) : 0) +
                              (selectedItems.rent ? Number(bill.rent_charge) : 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        marginTop: '32px',
                        paddingTop: '16px',
                        borderTop: '2px solid #808080',
                        textAlign: 'center',
                      }}
                      className="mt-4! pt-3! sm:mt-8! sm:pt-4!"
                    >
                      <p style={{ fontSize: '14px', margin: 0 }} className="text-xs! sm:text-sm!">
                        Thank you for your payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action flex flex-col-reverse sm:flex-row justify-between w-full mt-0 gap-2">
              <button
                className="btn btn-ghost gap-2 w-full sm:w-auto"
                onClick={() => setShowPreview(false)}
                disabled={isGenerating}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Selection
              </button>

              <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
                <button className="btn btn-ghost w-full sm:w-auto" onClick={onClose} disabled={isGenerating}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary gap-2 w-full sm:w-auto"
                  onClick={handleDownload}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={isGenerating}>
          close
        </button>
      </form>
    </dialog>
  );
}
