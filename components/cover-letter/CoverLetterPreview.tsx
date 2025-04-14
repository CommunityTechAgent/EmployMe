import React from 'react';
import { ATSAnalysis } from '../../types/cover-letter.types';

interface CoverLetterPreviewProps {
  content: string;
  atsAnalysis?: ATSAnalysis;
  isLoading?: boolean;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  content,
  atsAnalysis,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        Your cover letter will appear here
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Cover Letter</h2>
        <div className="prose max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {atsAnalysis && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">ATS Analysis</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Overall Score</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${atsAnalysis.score}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{atsAnalysis.score}%</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Keyword Score</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${atsAnalysis.keywordScore}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{atsAnalysis.keywordScore}%</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Formatting Score</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${atsAnalysis.formattingScore}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{atsAnalysis.formattingScore}%</p>
              </div>
            </div>

            {atsAnalysis.missingKeywords.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Missing Keywords</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {atsAnalysis.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {atsAnalysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Recommendations</h3>
                <ul className="mt-2 space-y-2">
                  {atsAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                      <span className="ml-2 text-sm text-gray-600">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterPreview; 