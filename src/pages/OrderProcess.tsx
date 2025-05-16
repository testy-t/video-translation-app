{
  /* Содержимое текущего шага */
}
<div className="bg-white rounded-lg shadow-sm p-6">
  {currentStep === 0 && (
    <UploadVideoStep
      videoFile={videoFile}
      setVideoFile={setVideoFile}
      onNext={goToNextStep}
    />
  )}

  {currentStep === 1 && (
    <SelectLanguageStep
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  )}

  {currentStep === 2 && (
    <PaymentStep
      videoFile={videoFile}
      selectedLanguage={selectedLanguage}
      onPayment={handlePayment}
    />
  )}

  {currentStep === 3 && <ResultStep orderNumber={orderNumber} />}
</div>;
