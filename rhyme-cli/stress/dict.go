package stress

import (
	"encoding/json"
	"fmt"
	"os"
)

// Dict е речник с ударения (дума -> позиция на ударението, 1-based)
var Dict map[string]interface{}

// LoadDict зарежда речник от JSON файл
func LoadDict(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		// Ако файлът не съществува, създаваме празен речник
		Dict = make(map[string]interface{})
		return nil
	}

	Dict = make(map[string]interface{})
	return json.Unmarshal(data, &Dict)
}

// SaveDict записва речника във файл
func SaveDict(path string) error {
	data, err := json.MarshalIndent(Dict, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal dict: %w", err)
	}

	return os.WriteFile(path, data, 0644)
}

// resolve извлича ударението от речника (поддържа int или []int)
func resolve(v interface{}) int {
	switch val := v.(type) {
	case float64:
		return int(val)
	case int:
		return val
	case []interface{}:
		if len(val) > 0 {
			if num, ok := val[0].(float64); ok {
				return int(num)
			}
		}
	}
	return 0
}

// GetFromDict получава ударението от речника
func GetFromDict(word string) (int, bool) {
	if Dict == nil {
		return 0, false
	}
	
	val, ok := Dict[word]
	if !ok {
		return 0, false
	}
	
	stress := resolve(val)
	return stress, stress > 0
}
