package entity

import "gorm.io/gorm"

type Subscribe struct {
	gorm.Model

	PackageID *uint
	Package   Package `gorm:"references:id"`

	SubscribeStatusID *uint
	SubscribeStatus   SubscribeStatus `gorm:"references:id"`

	UserID *uint
	User   User `gorm:"references:id"`


}

type SubscribeStatus struct {
	gorm.Model
	Status string `gorm:"uniqueIndex"`

	Subscribe []Subscribe `gorm:"foreignKey:SubscribeStatusID"`
}
