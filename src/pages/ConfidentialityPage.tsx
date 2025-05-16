
import React from "react";
import DocumentLayout from "@/components/legal/DocumentLayout";
import PolicySection from "@/components/legal/PolicySection";
import PolicySubsection from "@/components/legal/PolicySubsection";
import PolicyList from "@/components/legal/PolicyList";
import PolicyParagraph from "@/components/legal/PolicyParagraph";
import EmailLink from "@/components/legal/EmailLink";

import {
  introductionData,
  informationCollectedData,
  informationUsageData,
  informationDisclosureData,
  dataSecurity,
  userRights,
  cookiesPolicy,
  childrenPolicy,
  policyChanges,
  contactInfo
} from "@/data/confidentialityPolicy";

/**
 * Страница политики конфиденциальности
 */
const ConfidentialityPage: React.FC = () => {
  return (
    <DocumentLayout title="Политика конфиденциальности">
      {/* Раздел 1: Введение */}
      <PolicySection id={introductionData.id} title={introductionData.title}>
        {introductionData.paragraphs.map((paragraph, index) => (
          <PolicyParagraph key={index}>{paragraph}</PolicyParagraph>
        ))}
      </PolicySection>
      
      {/* Раздел 2: Информация, которую мы собираем */}
      <PolicySection id={informationCollectedData.id} title={informationCollectedData.title}>
        <PolicyParagraph>{informationCollectedData.intro}</PolicyParagraph>
        
        {informationCollectedData.subsections.map((subsection, index) => (
          <PolicySubsection key={index} id={subsection.id} title={subsection.title}>
            <PolicyParagraph>{subsection.content}</PolicyParagraph>
            {subsection.items && <PolicyList items={subsection.items} />}
          </PolicySubsection>
        ))}
      </PolicySection>
      
      {/* Раздел 3: Как мы используем информацию */}
      <PolicySection id={informationUsageData.id} title={informationUsageData.title}>
        <PolicyParagraph>{informationUsageData.intro}</PolicyParagraph>
        <PolicyList items={informationUsageData.items} />
      </PolicySection>
      
      {/* Раздел 4: Раскрытие информации */}
      <PolicySection id={informationDisclosureData.id} title={informationDisclosureData.title}>
        <PolicyParagraph>{informationDisclosureData.intro}</PolicyParagraph>
        
        {informationDisclosureData.subsections.map((subsection, index) => (
          <PolicySubsection key={index} id={subsection.id} title={subsection.title}>
            <PolicyParagraph className={index === informationDisclosureData.subsections.length - 1 ? "" : "mb-4"}>
              {subsection.content}
            </PolicyParagraph>
          </PolicySubsection>
        ))}
      </PolicySection>
      
      {/* Раздел 5: Безопасность данных */}
      <PolicySection id={dataSecurity.id} title={dataSecurity.title}>
        <PolicyParagraph>{dataSecurity.content}</PolicyParagraph>
      </PolicySection>
      
      {/* Раздел 6: Ваши права */}
      <PolicySection id={userRights.id} title={userRights.title}>
        <PolicyParagraph>{userRights.intro}</PolicyParagraph>
        <PolicyList items={userRights.rights} />
        <PolicyParagraph>
          {userRights.contact}{" "}
          <EmailLink email="support@golosok.ai" />
        </PolicyParagraph>
      </PolicySection>
      
      {/* Раздел 7: Файлы cookie */}
      <PolicySection id={cookiesPolicy.id} title={cookiesPolicy.title}>
        {cookiesPolicy.paragraphs.map((paragraph, index) => (
          <PolicyParagraph 
            key={index} 
            className={index === cookiesPolicy.paragraphs.length - 1 ? "" : "mb-4"}
          >
            {paragraph}
          </PolicyParagraph>
        ))}
      </PolicySection>
      
      {/* Раздел 8: Дети */}
      <PolicySection id={childrenPolicy.id} title={childrenPolicy.title}>
        <PolicyParagraph>{childrenPolicy.content}</PolicyParagraph>
      </PolicySection>
      
      {/* Раздел 9: Изменения в политике */}
      <PolicySection id={policyChanges.id} title={policyChanges.title}>
        {policyChanges.paragraphs.map((paragraph, index) => (
          <PolicyParagraph 
            key={index} 
            className={index === policyChanges.paragraphs.length - 1 ? "" : "mb-4"}
          >
            {paragraph}
          </PolicyParagraph>
        ))}
      </PolicySection>
      
      {/* Раздел 10: Контакты */}
      <PolicySection id={contactInfo.id} title={contactInfo.title} className="">
        <PolicyParagraph>{contactInfo.intro}</PolicyParagraph>
        <PolicyParagraph className="">
          <EmailLink email={contactInfo.email} />
        </PolicyParagraph>
      </PolicySection>
    </DocumentLayout>
  );
};

export default ConfidentialityPage;
