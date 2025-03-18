import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Form component that handles state management, validation, and submission
 */
const Form = ({
  onSubmit,
  onValidationChange,
  initialValues = {},
  validationSchema = {},
  children,
  disabled = false,
  loading = false,
  resetOnSubmit = false,
  className = '',
  ...props
}) => {
  // Form values state
  const [values, setValues] = useState(initialValues);
  // Form errors state - tracks validation errors for each field
  const [errors, setErrors] = useState({});
  // Touched fields - tracks which fields have been interacted with
  const [touched, setTouched] = useState({});
  // Form-level valid state
  const [isValid, setIsValid] = useState(false);
  // Form has been submitted
  const [submitted, setSubmitted] = useState(false);

  // Helper to validate a single field
  const validateField = (name, value) => {
    if (!validationSchema[name]) return null;
    
    try {
      const validator = validationSchema[name];
      const result = validator(value, values);
      return result === true ? null : result;
    } catch (error) {
      console.error(`Validation error for field ${name}:`, error);
      return 'Validation error occurred';
    }
  };

  // Validate all fields and return an object with errors
  const validateForm = () => {
    const newErrors = {};
    let formValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        formValid = false;
      }
    });

    return { errors: newErrors, isValid: formValid };
  };

  // Update values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [JSON.stringify(initialValues)]);

  // Validate form when values or validation schema changes
  useEffect(() => {
    if (Object.keys(touched).length > 0 || submitted) {
      const { errors: newErrors, isValid: formValid } = validateForm();
      setErrors(newErrors);
      setIsValid(formValid);
      
      if (onValidationChange) {
        onValidationChange(formValid, newErrors);
      }
    }
  }, [values, validationSchema, submitted]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update values
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));

    // Mark field as touched
    if (!touched[name]) {
      setTouched(prevTouched => ({
        ...prevTouched,
        [name]: true
      }));
    }
    
    // Immediately validate the field if it's been touched
    if (validationSchema[name]) {
      try {
        const validationResult = validationSchema[name](fieldValue, values);
        if (validationResult !== true) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [name]: validationResult
          }));
        } else {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
          });
        }
      } catch (err) {
        console.error(`Validation error for field ${name}:`, err);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Force validation of all fields
    const { errors: newErrors, isValid: formValid } = validateForm();
    setErrors(newErrors);
    setIsValid(formValid);

    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Only submit if valid
    if (formValid && onSubmit) {
      onSubmit(values, e);
      
      // Reset form if specified
      if (resetOnSubmit) {
        setValues(initialValues);
        setTouched({});
        setSubmitted(false);
      }
    }
  };

  // Reset the form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  // Prepare the form context values to be passed down to children
  const formContextValue = {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue: (name, value) => {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
      if (!touched[name]) {
        setTouched(prevTouched => ({
          ...prevTouched,
          [name]: true
        }));
      }
    },
    setFieldTouched: (name, isTouched = true) => {
      setTouched(prevTouched => ({
        ...prevTouched,
        [name]: isTouched
      }));
    },
    isSubmitting: loading,
    isValid,
    resetForm
  };

  // Form styles
  const formStyle = {
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  };

  // Loading overlay styles with safe backgroundColor
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 'inherit',
  };

  // Clone children and inject form props
  const childrenWithProps = React.Children.map(children, child => {
    // Ignore non-element children
    if (!React.isValidElement(child)) return child;

    // If the child has a name prop, it's likely a form field
    if (child.props.name) {
      const fieldName = child.props.name;
      const fieldValue = values[fieldName];
      
      const props = {
        value: fieldValue !== undefined && fieldValue !== null ? fieldValue : '',
        onChange: handleChange,
        error: errors[fieldName],
        disabled: disabled || loading || child.props.disabled,
      };
      
      return React.cloneElement(child, props);
    }

    // If it's a submit button
    if (child.props.type === 'submit') {
      return React.cloneElement(child, {
        disabled: disabled || loading || (!isValid && submitted) || child.props.disabled
      });
    }
    
    // If it's a container element with children, process its children
    if (child.props.children) {
      // Process each child of the container separately 
      const nestedChildren = React.Children.map(child.props.children, nestedChild => {
        if (!React.isValidElement(nestedChild)) return nestedChild;
        
        // Handle nested form fields
        if (nestedChild.props.name) {
          const fieldName = nestedChild.props.name;
          const fieldValue = values[fieldName];
          
          return React.cloneElement(nestedChild, {
            value: fieldValue !== undefined && fieldValue !== null ? fieldValue : '',
            onChange: handleChange,
            error: errors[fieldName],
            disabled: disabled || loading || nestedChild.props.disabled,
          });
        }
        
        return nestedChild;
      });
      
      // Return the container with processed children
      return React.cloneElement(child, { children: nestedChildren });
    }

    // For other elements, pass them as is
    return child;
  });

  // Extract style from props safely
  const { style: propsStyle, ...otherProps } = props;

  return (
    <form 
      style={{
        width: '100%',
        position: 'relative',
        backgroundColor: 'white',
        ...(propsStyle || {})
      }}
      className={className} 
      onSubmit={handleSubmit} 
      noValidate 
      {...otherProps}
    >
      {childrenWithProps}
      
      {/* Loading overlay */}
      {loading && (
        <div style={overlayStyle}>
          <div>Loading...</div>
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  /**
   * Function called when form is submitted and valid
   */
  onSubmit: PropTypes.func,
  /**
   * Function called when form validation state changes
   */
  onValidationChange: PropTypes.func,
  /**
   * Initial values for form fields
   */
  initialValues: PropTypes.object,
  /**
   * Validation schema - object with field names as keys and validator functions as values
   */
  validationSchema: PropTypes.object,
  /**
   * Form content
   */
  children: PropTypes.node.isRequired,
  /**
   * Whether the form is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Whether the form is in loading state
   */
  loading: PropTypes.bool,
  /**
   * Whether to reset form values after successful submission
   */
  resetOnSubmit: PropTypes.bool,
  /**
   * Additional CSS class
   */
  className: PropTypes.string,
};

export default Form; 