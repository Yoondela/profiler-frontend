import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import PlHolderIcon from '../../../assets/icons/booking-process-icons/file-config-svgrepo-com.svg?react';
import CarSmallIcon from '../../../assets/icons/subject-size/car/small-car.svg?react';
import CarLargeIcon from '../../../assets/icons/subject-size/car/mid-car-suv.svg?react';
import CarXLIcon from '../../../assets/icons/subject-size/car/large-car.svg?react';
import Clean1Icon from '../../../assets/icons/subject-size/house/small-house-3.svg?react';
import Clean2Icon from '../../../assets/icons/subject-size/house/small-house.svg?react';
import Clean3Icon from '../../../assets/icons/subject-size/house/mid-house.svg?react';
import GardenSmallIcon from '../../../assets/icons/subject-size/field/numeric-1.svg?react';
import GardenMediumIcon from '../../../assets/icons/subject-size/field/numeric-2.svg?react';
import GardenLargeIcon from '../../../assets/icons/subject-size/field/numeric-3.svg?react';
import { useServiceBooking } from '../contexts/ServiceBookingContext';
import { useServiceRequest } from '../contexts/ServiceRequestContext';

const sizeOptions = {
  'Car Wash': ['SM', 'L', 'XL'],
  Cleaning: ['1 Bed', '2-3 Bed', '4+ Beds'],
  Gardening: ['1-3 M', '4-5 M', '5+ M'],
};

const serviceIcons = {
  'Car Wash': [CarSmallIcon, CarLargeIcon, CarXLIcon],
  Cleaning: [Clean1Icon, Clean2Icon, Clean3Icon],
  Gardening: [GardenSmallIcon, GardenMediumIcon, GardenLargeIcon],
};

export default function SelectSizePopup({ mode, onConfirm, onCancel }) {
  const bookingState = useServiceBooking();
  const requestState = useServiceRequest();

  const { userService, subjectSize, setSubjectSize } =
    mode === 'booking' ? bookingState : requestState;

  const options = sizeOptions[userService] || [];
  const icons = serviceIcons[userService] || [];

  if (!userService) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="closer">
          <X size={18} className="popup-close" onClick={onCancel} />
        </div>

        <div className="popup-sub-title">
          <h2 className="popup-title">
            Indicate <strong>size</strong>
          </h2>
        </div>

        <div className="subject-size">
          {options.map((size, index) => {
            const IconComponent = icons[index] || PlHolderIcon;
            return (
              <div
                key={index}
                className={`size-${index + 1} size-item ${subjectSize === size ? 'selected' : ''}`}
                onClick={() => setSubjectSize(size)}
              >
                <div className="subject">
                  <IconComponent width="40" height="40" />
                </div>
                <div className="size">
                  <p>
                    <strong>{size}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="remove-or-cancel">
          <button
            className="cancel-remove"
            onClick={onConfirm}
            disabled={!subjectSize}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
