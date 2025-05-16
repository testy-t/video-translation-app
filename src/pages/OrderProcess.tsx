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
{
  /* Навигационные кнопки */
}
<div className="flex justify-between mt-6">
  {currentStep > 0 && (
    <Button
      variant="outline"
      onClick={goToPreviousStep}
      className="flex items-center"
    >
      <Icon name="ChevronLeft" className="mr-2" size={16} />
      Назад
    </Button>
  )}

  <div className="ml-auto">
    {currentStep < steps.length - 1 && currentStep !== 0 && (
      <Button onClick={goToNextStep}>
        Продолжить
        <Icon name="ChevronRight" className="ml-2" size={16} />
      </Button>
    )}
  </div>
</div>;
